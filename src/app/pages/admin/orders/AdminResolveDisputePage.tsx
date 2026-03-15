import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  ArrowLeft,
  AlertCircle,
  User,
  Store,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

const mockDispute = {
  id: 'DIS-001',
  orderId: 'ORD-2024-006',
  created: '2024-02-14',
  status: 'pending',
  priority: 'high',
  amount: 1950000,
  customer: {
    name: 'Nguyen Thi F',
    email: 'nguyenthif@gmail.com',
    claim: 'Item not as described',
    description: 'The blazer I received is completely different from what was shown in the product images. The color is off, the material feels cheap, and the fit is not as described. I am very disappointed with this purchase and would like a full refund.',
    evidence: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300', caption: 'Received product - front view' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=300', caption: 'Received product - close up of material' },
    ],
    submittedAt: '2024-02-14 10:30',
  },
  brand: {
    name: 'COS',
    email: 'cos@gmail.com',
    response: 'We apologize for any dissatisfaction. However, the product images on our website accurately represent the item. The color variation may be due to different screen settings. We stand by the quality of our products and believe this is within acceptable standards.',
    evidence: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300', caption: 'Original product listing image' },
    ],
    respondedAt: '2024-02-14 15:45',
  },
  orderDetails: {
    items: [
      { name: 'Classic Wool Blazer', sku: 'COS-BLZ-089', price: 1950000, quantity: 1 },
    ],
    total: 1950000,
    orderDate: '2024-02-10',
    deliveryDate: '2024-02-13',
  },
};

const priorityConfig = {
  high: { label: 'High', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
  medium: { label: 'Medium', color: 'bg-[#F54900]/10 text-[#F54900]' },
  low: { label: 'Low', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
};

export default function AdminResolveDisputePage() {
  const { id } = useParams();
  const [dispute, setDispute] = useState(mockDispute);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [decision, setDecision] = useState('');
  const [refundAmount, setRefundAmount] = useState(dispute.amount.toString());
  const [adminNotes, setAdminNotes] = useState('');

  const handleResolve = () => {
    setDispute({ ...dispute, status: 'resolved' });
    setResolveModalOpen(false);
    toast.success('Dispute resolved in favor of customer');
  };

  const handleReject = () => {
    setDispute({ ...dispute, status: 'rejected' });
    setRejectModalOpen(false);
    toast.success('Dispute rejected');
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: '16px' }}>
          <Link to="/admin/orders/disputes">
            <Button
              variant="outline"
              size="sm"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                padding: '0',
              }}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
            </Button>
          </Link>
          <div>
            <h1
              className="text-[#0A0A0A]"
              style={{
                fontSize: '36px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              Dispute {dispute.id}
            </h1>
            <p
              className="text-[#4A5565]"
              style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
            >
              Order {dispute.orderId} • Created {new Date(dispute.created).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Badge
            className={priorityConfig[dispute.priority as keyof typeof priorityConfig].color}
            style={{
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '8px 16px',
            }}
          >
            {priorityConfig[dispute.priority as keyof typeof priorityConfig].label} Priority
          </Badge>
          {dispute.status === 'pending' && (
            <>
              <Button
                onClick={() => setRejectModalOpen(true)}
                variant="outline"
                className="border-[#E7000B] text-[#E7000B]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '0 24px',
                }}
              >
                <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Reject Dispute
              </Button>
              <Button
                onClick={() => setResolveModalOpen(true)}
                className="bg-[#10B981] text-white hover:bg-[#10B981]/90"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '0 24px',
                }}
              >
                <CheckCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Resolve Dispute
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Order Info */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <h3
          className="text-[#0A0A0A]"
          style={{
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: 'Arimo, sans-serif',
            marginBottom: '16px',
          }}
        >
          Order Details
        </h3>
        <div className="grid grid-cols-4" style={{ gap: '24px' }}>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '12px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              Order ID
            </p>
            <Link to={`/admin/orders/${dispute.orderId}`}>
              <p
                className="text-[#0A0A0A] hover:underline"
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {dispute.orderId}
              </p>
            </Link>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '12px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              Order Date
            </p>
            <p
              className="text-[#0A0A0A]"
              style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
            >
              {new Date(dispute.orderDetails.orderDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '12px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              Delivered
            </p>
            <p
              className="text-[#0A0A0A]"
              style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
            >
              {new Date(dispute.orderDetails.deliveryDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '12px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              Amount
            </p>
            <p
              className="text-[#0A0A0A]"
              style={{
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              {dispute.amount.toLocaleString('vi-VN')}đ
            </p>
          </div>
        </div>
        <div className="border-t border-[#E5E7EB]" style={{ marginTop: '16px', paddingTop: '16px' }}>
          <p
            className="text-[#6A7282]"
            style={{
              fontSize: '12px',
              fontFamily: 'Arimo, sans-serif',
              marginBottom: '8px',
            }}
          >
            Items
          </p>
          {dispute.orderDetails.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {item.name}
                </p>
                <p
                  className="text-[#6A7282]"
                  style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                >
                  SKU: {item.sku} • Qty: {item.quantity}
                </p>
              </div>
              <p
                className="text-[#0A0A0A]"
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                {item.price.toLocaleString('vi-VN')}đ
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2" style={{ gap: '24px' }}>
        {/* Customer Side */}
        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center" style={{ gap: '12px', marginBottom: '20px' }}>
            <div
              className="flex items-center justify-center bg-[#3B82F6]/10"
              style={{ width: '40px', height: '40px', borderRadius: '10px' }}
            >
              <User className="text-[#3B82F6]" style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h3
                className="text-[#0A0A0A]"
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                Customer Claim
              </h3>
              <p
                className="text-[#6A7282]"
                style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
              >
                {dispute.customer.name} • {dispute.customer.email}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '12px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              Reason
            </p>
            <p
              className="text-[#0A0A0A]"
              style={{
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '12px',
              }}
            >
              {dispute.customer.claim}
            </p>
            <p
              className="text-[#0A0A0A]"
              style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', lineHeight: '1.6' }}
            >
              {dispute.customer.description}
            </p>
          </div>

          <div>
            <div className="flex items-center" style={{ gap: '8px', marginBottom: '12px' }}>
              <ImageIcon className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
              <p
                className="text-[#6A7282]"
                style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
              >
                Evidence ({dispute.customer.evidence.length})
              </p>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '12px' }}>
              {dispute.customer.evidence.map((item, idx) => (
                <div key={idx}>
                  <img
                    src={item.url}
                    alt={item.caption}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      marginBottom: '8px',
                    }}
                  />
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {item.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="border-t border-[#E5E7EB]"
            style={{ marginTop: '20px', paddingTop: '12px' }}
          >
            <p
              className="text-[#6A7282]"
              style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
            >
              Submitted at {dispute.customer.submittedAt}
            </p>
          </div>
        </Card>

        {/* Brand Side */}
        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center" style={{ gap: '12px', marginBottom: '20px' }}>
            <div
              className="flex items-center justify-center bg-[#F54900]/10"
              style={{ width: '40px', height: '40px', borderRadius: '10px' }}
            >
              <Store className="text-[#F54900]" style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h3
                className="text-[#0A0A0A]"
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                Brand Response
              </h3>
              <p
                className="text-[#6A7282]"
                style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
              >
                {dispute.brand.name} • {dispute.brand.email}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '12px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              Response
            </p>
            <p
              className="text-[#0A0A0A]"
              style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif', lineHeight: '1.6' }}
            >
              {dispute.brand.response}
            </p>
          </div>

          <div>
            <div className="flex items-center" style={{ gap: '8px', marginBottom: '12px' }}>
              <ImageIcon className="text-[#6A7282]" style={{ width: '16px', height: '16px' }} />
              <p
                className="text-[#6A7282]"
                style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
              >
                Evidence ({dispute.brand.evidence.length})
              </p>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '12px' }}>
              {dispute.brand.evidence.map((item, idx) => (
                <div key={idx}>
                  <img
                    src={item.url}
                    alt={item.caption}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      marginBottom: '8px',
                    }}
                  />
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {item.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="border-t border-[#E5E7EB]"
            style={{ marginTop: '20px', paddingTop: '12px' }}
          >
            <p
              className="text-[#6A7282]"
              style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
            >
              Responded at {dispute.brand.respondedAt}
            </p>
          </div>
        </Card>
      </div>

      {/* Resolve Modal */}
      <Dialog open={resolveModalOpen} onOpenChange={setResolveModalOpen}>
        <DialogContent style={{ maxWidth: '600px', borderRadius: '14px', padding: '32px' }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              Resolve Dispute
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              Resolve this dispute in favor of the customer
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col" style={{ gap: '20px', marginTop: '24px' }}>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Refund Amount *
              </Label>
              <Input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
              <p
                className="text-[#6A7282]"
                style={{
                  fontSize: '12px',
                  fontFamily: 'Arimo, sans-serif',
                  marginTop: '6px',
                }}
              >
                Original amount: {dispute.amount.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Decision Summary *
              </Label>
              <Textarea
                placeholder="Explain your decision..."
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                className="border-[#D1D5DC]"
                style={{
                  minHeight: '120px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Admin Notes (Internal)
              </Label>
              <Textarea
                placeholder="Internal notes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="border-[#D1D5DC]"
                style={{
                  minHeight: '80px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
          </div>
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => setResolveModalOpen(false)}
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResolve}
              className="bg-[#10B981] text-white hover:bg-[#10B981]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              <CheckCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Resolve & Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent style={{ maxWidth: '600px', borderRadius: '14px', padding: '32px' }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              Reject Dispute
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              Reject this dispute in favor of the brand
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col" style={{ gap: '20px', marginTop: '24px' }}>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Decision Summary *
              </Label>
              <Textarea
                placeholder="Explain why you're rejecting this dispute..."
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                className="border-[#D1D5DC]"
                style={{
                  minHeight: '120px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Admin Notes (Internal)
              </Label>
              <Textarea
                placeholder="Internal notes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="border-[#D1D5DC]"
                style={{
                  minHeight: '80px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
          </div>
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => setRejectModalOpen(false)}
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              className="bg-[#E7000B] text-white hover:bg-[#E7000B]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Reject Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
