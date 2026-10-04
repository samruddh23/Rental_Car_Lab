import React from 'react';
import { CheckCircleIcon } from './Icons';

export const InvoiceModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const total = Number(booking.totalAmount) || 12386;
  const baseFare = Math.round(total / 1.18);
  const gstTotal = total - baseFare;
  const cgst = Math.round(gstTotal / 2);
  const sgst = gstTotal - cgst;
  const invoiceNumber = `INV-APEX-${(booking.id || 'IN-670793').replace(/\D/g, '')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 border border-slate-200 shadow-2xl relative my-8 print:p-0 print:border-none print:shadow-none">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500" />
              GST Tax Compliant (SAC 996601)
            </span>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
              Experiment 8: Invoice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
            >
              🖨️ Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="text-slate-800 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b border-slate-200 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
                  A
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  ApexDrive <span className="text-indigo-600">Bharat</span>
                </h2>
              </div>
              <p className="text-[10px] text-slate-500">ApexDrive Bharat Mobility Technologies Pvt. Ltd.</p>
              <p className="text-[10px] text-slate-500">BKC, Bandra East, Mumbai, Maharashtra 400051</p>
              <p className="text-[10px] font-mono text-slate-700 mt-1">
                <strong>GSTIN:</strong> 27AABCA1234F1Z9 | <strong>PAN:</strong> AABCA1234F
              </p>
            </div>
            <div className="text-right">
              <span className="bg-slate-900 text-white px-3 py-1 rounded font-bold text-[10px] uppercase tracking-wider block mb-2">
                Tax Invoice
              </span>
              <p className="font-mono font-bold text-slate-900 text-sm">{invoiceNumber}</p>
              <p className="text-[11px] text-slate-500">Date: {new Date().toLocaleDateString('en-IN')}</p>
              <p className="text-[11px] text-emerald-600 font-bold">Status: PAID (Razorpay UPI)</p>
            </div>
          </div>

          {/* Billed To / Rental Details Grid */}
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-100 mb-6">
            <div>
              <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-1">Billed To (Customer)</p>
              <p className="font-bold text-slate-900 text-sm">{booking.customerName || 'Customer'}</p>
              <p className="text-[11px] text-slate-600">{booking.customerEmail}</p>
              <p className="text-[11px] text-slate-600">{booking.customerPhone}</p>
              <p className="text-[10px] font-mono text-slate-500 mt-1">DL No: {booking.licenseNumber || 'MH02-2023-0091823'}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-1">Rental Assignment</p>
              <p className="font-bold text-indigo-700 text-sm">{booking.carMake} {booking.carModel}</p>
              <p className="text-[11px] text-slate-600">Booking Ref: <span className="font-mono font-bold">{booking.id}</span></p>
              <p className="text-[11px] text-slate-600">Period: {booking.pickupDate} → {booking.returnDate} ({booking.days || 1} Days)</p>
              <p className="text-[11px] text-slate-600">Hub: {booking.pickupLocation || 'Mumbai Central Hub'}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left mb-6">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[9px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Service Description</th>
                <th className="py-2.5 px-3">SAC Code</th>
                <th className="py-2.5 px-3 text-right">Taxable Value (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-900">Self-Drive Passenger Car Rental ({booking.carMake} {booking.carModel})</p>
                  <p className="text-[10px] text-slate-500">{booking.days || 1} day(s) duration at applicable tariff</p>
                </td>
                <td className="py-3 px-3 font-mono text-slate-600">996601</td>
                <td className="py-3 px-3 text-right font-medium">₹{baseFare.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-2 px-3">
                  <p className="font-bold text-slate-800">Pre-Activated FASTag Highway Pass</p>
                  <p className="text-[10px] text-slate-500">Unlimited toll plaza transit across NHAI lanes</p>
                </td>
                <td className="py-2 px-3 font-mono text-slate-600">996601</td>
                <td className="py-2 px-3 text-right font-medium">₹499</td>
              </tr>
              <tr>
                <td className="py-2 px-3">
                  <p className="font-bold text-slate-800">Comprehensive Zero-Depreciation Insurance</p>
                </td>
                <td className="py-2 px-3 font-mono text-slate-600">997132</td>
                <td className="py-2 px-3 text-right font-medium text-emerald-600">Included</td>
              </tr>
            </tbody>
          </table>

          {/* Tax Calculation Breakdown */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-1.5 text-right">
              <div className="flex justify-between text-slate-600">
                <span>Base Subtotal:</span>
                <span className="font-medium">₹{baseFare.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Central GST (CGST 9%):</span>
                <span className="font-medium">₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State GST (SGST 9%):</span>
                <span className="font-medium">₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                <span>Total Amount Paid:</span>
                <span className="text-indigo-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signature Stamp */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
            <div className="text-[10px] text-slate-400 max-w-sm">
              <p>This is a computer-generated tax invoice issued in accordance with Section 31 of the CGST Act, 2017.</p>
              <p className="mt-1 font-mono">Payment TransID: {booking.transactionId || 'TXN-UPI-SUCCESS-9812'}</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-12 border-2 border-dashed border-indigo-200 rounded-lg flex items-center justify-center mx-auto mb-1">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">DIGITAL SEAL</span>
              </div>
              <p className="text-[10px] font-bold text-slate-800">ApexDrive Bharat Finance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
