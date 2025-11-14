import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Check, X, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string | null;
  status: string;
  description: string | null;
  total_amount: number;
  approval_notes: string | null;
  approved_at: string | null;
  created_at: string;
  purchase_order_items?: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id: string;
  product_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export const PurchaseOrderManager = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [showAddPO, setShowAddPO] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [poForm, setPoForm] = useState({
    vendor_name: "",
    vendor_email: "",
    vendor_phone: "",
    description: "",
    items: [{ product_name: "", description: "", quantity: 1, unit_price: 0 }],
  });

  const [approvalForm, setApprovalForm] = useState({
    approval_notes: "",
  });

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("purchase_orders")
        .select(`
          *,
          purchase_order_items (
            id,
            product_name,
            description,
            quantity,
            unit_price,
            total_price
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPurchaseOrders(data || []);
    } catch (error) {
      console.error("Error fetching POs:", error);
      toast({
        title: "Error",
        description: "Failed to load purchase orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePONumber = () => {
    const timestamp = Date.now();
    return `PO-${new Date().getFullYear()}-${timestamp.toString().slice(-6)}`;
  };

  const calculateTotal = () => {
    return poForm.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  };

  const handleAddItem = () => {
    setPoForm({
      ...poForm,
      items: [...poForm.items, { product_name: "", description: "", quantity: 1, unit_price: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setPoForm({
      ...poForm,
      items: poForm.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...poForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setPoForm({ ...poForm, items: newItems });
  };

  const handleSubmitPO = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!poForm.vendor_name || !poForm.vendor_email || poForm.items.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        return;
      }

      const total = calculateTotal();
      const { data: { user } } = await supabase.auth.getUser();

      let poId = editingPO?.id;

      if (editingPO) {
        const { error } = await supabase
          .from("purchase_orders")
          .update({
            vendor_name: poForm.vendor_name,
            vendor_email: poForm.vendor_email,
            vendor_phone: poForm.vendor_phone,
            description: poForm.description,
            total_amount: total,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingPO.id);

        if (error) throw error;

        await supabase
          .from("purchase_order_items")
          .delete()
          .eq("purchase_order_id", editingPO.id);

        toast({ title: "PO updated successfully" });
      } else {
        const { data: newPO, error: poError } = await supabase
          .from("purchase_orders")
          .insert({
            po_number: generatePONumber(),
            vendor_name: poForm.vendor_name,
            vendor_email: poForm.vendor_email,
            vendor_phone: poForm.vendor_phone,
            description: poForm.description,
            total_amount: total,
            status: "draft",
            created_by: user?.id,
          })
          .select()
          .single();

        if (poError) throw poError;
        poId = newPO.id;
        toast({ title: "PO created successfully" });
      }

      if (poId) {
        const itemsData = poForm.items.map((item) => ({
          purchase_order_id: poId,
          product_name: item.product_name,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
        }));

        const { error: itemsError } = await supabase
          .from("purchase_order_items")
          .insert(itemsData);

        if (itemsError) throw itemsError;
      }

      resetPOForm();
      fetchPurchaseOrders();
    } catch (error) {
      console.error("Error saving PO:", error);
      toast({
        title: "Error",
        description: "Failed to save PO",
        variant: "destructive",
      });
    }
  };

  const handleApprovePO = async (po: PurchaseOrder) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from("purchase_orders")
        .update({
          status: "approved",
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          approval_notes: approvalForm.approval_notes,
        })
        .eq("id", po.id);

      if (updateError) throw updateError;

      await addAuditTrail(po.id, "approved", { approval_notes: approvalForm.approval_notes });

      await generateAndSendInvoice(po);

      toast({ title: "PO approved and invoice generated successfully" });
      setApprovalForm({ approval_notes: "" });
      setSelectedPO(null);
      fetchPurchaseOrders();
    } catch (error) {
      console.error("Error approving PO:", error);
      toast({
        title: "Error",
        description: "Failed to approve PO",
        variant: "destructive",
      });
    }
  };

  const generateAndSendInvoice = async (po: PurchaseOrder) => {
    try {
      const invoiceNumber = `INV-${po.po_number.split("-").pop()}-${Date.now().toString().slice(-4)}`;
      const invoiceData = {
        po_number: po.po_number,
        vendor_name: po.vendor_name,
        vendor_email: po.vendor_email,
        vendor_phone: po.vendor_phone,
        total_amount: po.total_amount,
        description: po.description,
        items: po.purchase_order_items || [],
        generated_at: new Date().toISOString(),
      };

      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: invoiceNumber,
          purchase_order_id: po.id,
          total_amount: po.total_amount,
          invoice_data: invoiceData,
          status: "pending",
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      const financeEmail = "finance@neemfurnitech.com";
      await supabase
        .from("finance_notifications")
        .insert({
          recipient_email: financeEmail,
          invoice_id: invoice.id,
          purchase_order_id: po.id,
          notification_type: "invoice_generated",
          subject: `Invoice Generated - PO ${po.po_number}`,
          message: `A new invoice has been generated for PO ${po.po_number}. Vendor: ${po.vendor_name}, Amount: ₹${po.total_amount}`,
        });

      await addAuditTrail(po.id, "invoiced", { invoice_number, invoice_id: invoice.id });
    } catch (error) {
      console.error("Error generating invoice:", error);
      throw error;
    }
  };

  const addAuditTrail = async (
    entityId: string,
    action: string,
    changes: Record<string, any>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase
        .from("audit_trail")
        .insert({
          entity_type: "purchase_order",
          entity_id: entityId,
          action: action,
          changed_by: user?.id,
          changes: changes,
        });
    } catch (error) {
      console.error("Error adding audit trail:", error);
    }
  };

  const handleDeletePO = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PO?")) return;

    try {
      const { error } = await supabase
        .from("purchase_orders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "PO deleted successfully" });
      fetchPurchaseOrders();
    } catch (error) {
      console.error("Error deleting PO:", error);
      toast({
        title: "Error",
        description: "Failed to delete PO",
        variant: "destructive",
      });
    }
  };

  const resetPOForm = () => {
    setPoForm({
      vendor_name: "",
      vendor_email: "",
      vendor_phone: "",
      description: "",
      items: [{ product_name: "", description: "", quantity: 1, unit_price: 0 }],
    });
    setShowAddPO(false);
    setEditingPO(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "invoiced":
        return "bg-blue-100 text-blue-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Purchase Orders</h2>
        <Button onClick={() => setShowAddPO(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create PO
        </Button>
      </div>

      {/* Add/Edit PO Form */}
      {showAddPO && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>{editingPO ? "Edit PO" : "Create New Purchase Order"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPO} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Vendor Name *</Label>
                  <Input
                    value={poForm.vendor_name}
                    onChange={(e) => setPoForm({ ...poForm, vendor_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Vendor Email *</Label>
                  <Input
                    type="email"
                    value={poForm.vendor_email}
                    onChange={(e) => setPoForm({ ...poForm, vendor_email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Vendor Phone</Label>
                  <Input
                    value={poForm.vendor_phone}
                    onChange={(e) => setPoForm({ ...poForm, vendor_phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={poForm.description}
                  onChange={(e) => setPoForm({ ...poForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {poForm.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2">
                      <Input
                        placeholder="Product name"
                        value={item.product_name}
                        onChange={(e) => handleItemChange(idx, "product_name", e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", parseInt(e.target.value) || 1)}
                      />
                      <Input
                        type="number"
                        placeholder="Unit Price"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(idx, "unit_price", parseFloat(e.target.value) || 0)}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold">Total: ₹{calculateTotal().toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save PO</Button>
                <Button type="button" variant="outline" onClick={resetPOForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* PO List */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {purchaseOrders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No purchase orders yet. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            purchaseOrders.map((po) => (
              <Card key={po.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{po.po_number}</h3>
                      <p className="text-muted-foreground">{po.vendor_name}</p>
                    </div>
                    <Badge className={getStatusColor(po.status)}>{po.status.toUpperCase()}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold">₹{po.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="font-semibold">{po.purchase_order_items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-semibold">{new Date(po.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold text-sm">{po.vendor_email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPO(po)}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    {po.status === "draft" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPO(po);
                            setShowAddPO(true);
                          }}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePO(po.id)}
                          className="gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </>
                    )}
                    {po.status === "submitted" && (
                      <Button
                        size="sm"
                        onClick={() => setSelectedPO(po)}
                        className="gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Review
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* PO Details & Approval Modal */}
      {selectedPO && (
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>PO Details: {selectedPO.po_number}</CardTitle>
              </div>
              <Button variant="ghost" onClick={() => setSelectedPO(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="font-semibold">{selectedPO.vendor_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-sm">{selectedPO.vendor_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold">₹{selectedPO.total_amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(selectedPO.status)}>
                  {selectedPO.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            {selectedPO.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{selectedPO.description}</p>
              </div>
            )}

            {selectedPO.purchase_order_items && (
              <div>
                <h4 className="font-semibold mb-3">Items</h4>
                <div className="space-y-2">
                  {selectedPO.purchase_order_items.map((item) => (
                    <div key={item.id} className="flex justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-semibold">{item.product_name}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Qty: {item.quantity}</p>
                        <p className="font-semibold">₹{item.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedPO.status === "submitted" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleApprovePO(selectedPO);
                }}
                className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200"
              >
                <h4 className="font-semibold">Approve Purchase Order</h4>
                <div>
                  <Label>Approval Notes</Label>
                  <Textarea
                    value={approvalForm.approval_notes}
                    onChange={(e) => setApprovalForm({ approval_notes: e.target.value })}
                    placeholder="Enter any approval notes..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="gap-2">
                    <Check className="h-4 w-4" />
                    Approve & Generate Invoice
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedPO(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
