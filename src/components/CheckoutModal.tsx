import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  AlertCircle,
  Tag,
  Ticket,
  Trash2,
  Clock,
  MessageCircle
} from 'lucide-react';
import { PaymentTransaction } from '../types';

// Pre-configured discount coupons
const AVAILABLE_COUPONS: Record<string, { discount: number; label: string }> = {
  'IKAMAI': { discount: 200, label: '₹200 Instant Discount' },
  'VRPRIME': { discount: 300, label: '₹300 Instant Discount' },
  'PREMIUM': { discount: 400, label: '₹400 Instant Discount' },
};

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    checkoutCourse, 
    submitPaymentProof,
    user,
    setActiveView 
  } = useAcademy();

  // Configurable UPI ID (default: official merchant VPA)
  const upiId = (import.meta as any).env?.VITE_UPI_ID || '7070806047@ikwik';
  const payeeName = 'MEW Academy';
  const baseAdmissionFee = checkoutCourse?.priceINR || 1599;

  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // UTR & Form states
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedTxn, setCompletedTxn] = useState<PaymentTransaction | null>(null);

  if (!isCheckoutOpen || !checkoutCourse) return null;

  const originalPrice = checkoutCourse.originalPriceINR || 4999;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPayable = Math.max(0, baseAdmissionFee - couponDiscount);
  const totalSavings = (originalPrice - baseAdmissionFee) + couponDiscount;

  // Authentic dynamic NPCI UPI Intent URI format with coupon-adjusted amount
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${finalPayable}.00&cu=INR&tn=${encodeURIComponent(appliedCoupon ? `MEW Academy Admission - Coupon ${appliedCoupon.code}` : 'MEW Academy Masterclass Admission')}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleApplyCoupon = (codeToApply?: string) => {
    const raw = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError('');
    setCouponSuccess('');
    
    if (!raw) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const matched = AVAILABLE_COUPONS[raw];
    if (matched) {
      setAppliedCoupon({
        code: raw,
        discount: matched.discount,
        label: matched.label
      });
      setCouponSuccess(`🎉 Coupon ${raw} applied! ₹${matched.discount} discount deducted.`);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Please enter a valid coupon.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const handleConfirmPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setErrorMessage('Please enter the 12-digit UPI Transaction ID from your payment receipt.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await submitPaymentProof({
        course: checkoutCourse,
        utrNumber: utrNumber.trim(),
        couponCode: appliedCoupon?.code,
        discountAmount: totalSavings,
        finalAmount: finalPayable,
        paymentMethodDetails: appliedCoupon
          ? `UPI (VPA: ${upiId} | Transaction ID: ${utrNumber.trim()} | Coupon: ${appliedCoupon.code} -₹${appliedCoupon.discount})`
          : `UPI (VPA: ${upiId} | Transaction ID: ${utrNumber.trim()})`,
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Unable to submit payment. Please verify your details.');
        return;
      }

      if (res.transaction) {
        setCompletedTxn(res.transaction);
      }
    } catch (err) {
      console.error('Payment submission error:', err);
      setErrorMessage('Unable to submit payment. Please try again or contact WhatsApp support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedTxn(null);
    setUtrNumber('');
    setErrorMessage('');
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
  };

  // High-resolution scannable QR Code URL with dynamic discounted amount
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=12&format=svg&data=${encodeURIComponent(upiDeepLink)}`;

  // Direct WhatsApp support link with prefilled payment details
  const waHelpText = encodeURIComponent(
    `Hi MEW Academy Admin! I have completed my payment of ₹${finalPayable} for "${checkoutCourse.title}".\n\nStudent: ${user.name || 'Student'}\nEmail: ${user.email}\nPhone: ${user.phone || 'N/A'}\nUPI Transaction ID: ${utrNumber || completedTxn?.utrNumber || 'Attached in Screenshot'}\n\nPlease verify and add me to the live batch WhatsApp group!`
  );
  const waDirectUrl = `https://wa.me/917070806047?text=${waHelpText}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm block leading-tight">Instant UPI Payment Gateway</span>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                256-Bit NPCI Compliant Secure Transfer
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {completedTxn ? (
          /* Payment Under Verification Step */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-amber-50">
              <Clock className="w-9 h-9 text-[#d9822b]" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                ⏳ Payment Submitted for Verification
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Thank You, {user.name || 'Student'}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                We have received your payment submission of <strong>₹{completedTxn.amount.toLocaleString('en-IN')}</strong> (UPI Transaction ID: <span className="font-mono font-bold text-slate-800">{completedTxn.utrNumber || utrNumber}</span>).
              </p>
            </div>

            {/* Information Callout */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <MessageCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Next Step: WhatsApp Batch Group Access</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Our admissions team is verifying your transaction. Once approved, your course will be activated and you will receive an official confirmation email with the invite link to join the <strong>Official WhatsApp Batch Group</strong> where all live Zoom &amp; Google Meet session links and datasets are provided.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800">{completedTxn.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Course:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[260px]">{checkoutCourse.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Submitted UPI Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800">{completedTxn.utrNumber || utrNumber}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-600 font-semibold">
                  <span>Coupon Applied:</span>
                  <span>{appliedCoupon.code} (-₹{appliedCoupon.discount})</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3" /> Under Verification
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-extrabold text-sm text-[#d9822b]">₹{completedTxn.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <a
                href={waDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Admin for Fast Approval</span>
              </a>

              <button
                onClick={() => {
                  handleClose();
                  setActiveView('dashboard');
                }}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs sm:text-sm rounded-xl shadow-lg border border-amber-400/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4 text-[#f5a623]" />
                <span>Go to Student Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
          /* Live UPI Checkout Step */
          <div className="p-5 sm:p-6 space-y-4">
            
            {/* Course Summary Banner */}
            <div className="flex items-center justify-between p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80">
              <div className="min-w-0 pr-3">
                <div className="text-[10px] font-mono uppercase font-bold text-amber-800 tracking-wider">
                  Course Admission
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {checkoutCourse.title}
                </h3>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Instructor: Prof. MD Tahseen Equbal • Live Masterclass
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg sm:text-xl font-black text-[#d9822b]">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </div>
                {appliedCoupon ? (
                  <div className="text-[10px] text-emerald-600 font-bold">
                    <span className="line-through text-slate-400 mr-1">₹{baseAdmissionFee}</span>
                    -₹{appliedCoupon.discount} off
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-[#d9822b]" />
                  <span>Have a Discount Coupon?</span>
                </label>
                {appliedCoupon && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Applied: -₹{appliedCoupon.discount}
                  </span>
                )}
              </div>

              {appliedCoupon ? (
                /* Active Coupon Pill */
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="font-mono font-black text-emerald-800">{appliedCoupon.code}</span>
                      <span className="text-[11px] text-emerald-700 ml-2">({appliedCoupon.label})</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer"
                    title="Remove coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              ) : (
                /* Coupon Input Field */
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {/* Coupon Messages */}
              {couponError && (
                <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}
              {couponSuccess && (
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{couponSuccess}</span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Centered QR Code Box */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Auto-generates ₹{finalPayable.toLocaleString('en-IN')} on Scan
              </div>

              {/* QR Image with subtle scan border */}
              <div className="relative mx-auto w-52 h-52 sm:w-56 sm:h-56 bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-md flex items-center justify-center">
                <img
                  src={qrCodeUrl}
                  alt={`Scan to pay ₹${finalPayable} to MEW Academy`}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto">
                Scan with <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, or <strong>BHIM</strong> to pay ₹{finalPayable.toLocaleString('en-IN')}.
              </p>

              {/* Copy UPI VPA strip */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-xs text-slate-500 font-mono">UPI ID:</span>
                <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 select-all">
                  {upiId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 12-Digit UPI Transaction ID Input Field */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Enter 12-Digit UPI Transaction ID: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={e => {
                  setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''));
                  setErrorMessage('');
                }}
                placeholder="e.g. 523412984012 (found in Google Pay / PhonePe / Paytm / BHIM)"
                maxLength={24}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold tracking-wider placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-500 block leading-tight">
                After completing the transfer in your UPI app (Google Pay, PhonePe, Paytm, etc.), copy the 12-digit UPI Transaction ID / Ref No. and enter it above to submit your admission for instant verification.
              </span>
            </div>

            {/* Submit Verification Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleConfirmPayment()}
                disabled={isProcessing}
                className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#d9822b] to-[#f5a623] hover:from-[#c87624] hover:to-[#e0961b] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Payment Proof...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit Payment for Verification (₹{finalPayable.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
