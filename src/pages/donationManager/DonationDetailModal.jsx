import React, { useState, useEffect } from "react";
import { Check, CheckSquare2, Save, Send, Square, Trash } from "lucide-react";
import { toDateInputValue } from "../../assets/helpers";
import { donationTemplate, paymentMethods } from "../../assets/variables";
import { Eye } from "lucide-react";

const DonationDetailModal = ({
  user,
  donation,
  payment,
  onClose,
  onSave,
  onUpdate,
}) => {
  const [formData, setFormData] = useState(donation || donationTemplate);

  const isNewDonation = !donation?.id;

  useEffect(() => {
    setFormData(donation);
  }, [donation]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isNewDonation) {
      const submitForm = { ...formData, createdBy: user.user };
      setFormData(submitForm);
      onSave(submitForm);
    } else {
      onUpdate(formData);
    }
  };

  const handleActivate = () => {
    if (
      !formData.amount ||
      !formData.frequency ||
      !formData.paymentMethod ||
      !formData.createdDate ||
      !formData.startDate
    ) {
      alert("You have missed donation information");
      return;
    }

    if (formData.amount * 1 <= 0) {
      alert("Amount is not valid");
      return;
    }

    if (formData.startDate < formData.createdDate) {
      alert("Created date must be before startDate");
      return;
    }

    if (!confirm("Do you want to activate this donation")) return;
    const submitForm = { ...formData };
    setFormData(submitForm);
    onUpdate(submitForm, "activate");
  };

  const handleCancel = () => {
    if (!confirm("Do you want to cancel this donation")) return;
    const submitForm = { ...formData };
    setFormData(submitForm);
    onUpdate(submitForm, "cancelled");
  };

  const handleOpenPaymentModal = (payment) => {
    console.log(payment);
  };



  const donorInformation = (donation) => {
    return (
      <>
        <h2 className="mt-4 font-bold">Donor information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 border-b pb-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Business name</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="text"
              name="bizName"
              value={formData.bizName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Address2</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">City</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">State</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Zip code</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone number</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email address</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </>
    );
  };

  const donationInformation = (donation) => {
    return (
      <>
        <h3 className="font-bold">Donation information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 ">
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              disabled={
                formData.status === "active" || formData.status === "cancelled"
                  ? true
                  : false
              }
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Frequency</label>
            <select
              disabled={
                formData.status === "active" || formData.status === "cancelled"
                  ? true
                  : false
              }
              type="text"
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value=""></option>
              <option value="Yearly">Yearly</option>
              <option value="Monthly">Monthly</option>
              <option value="Biweekly">Biweekly</option>
              <option value="One Time">One Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Payment method</label>
            <select
              disabled={
                formData.status === "active" || formData.status === "cancelled"
                  ? true
                  : false
              }
              type="text"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value=""></option>
              {paymentMethods.map((v, i) => (
                <option key={i} value={v.value}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Created date</label>
            <input
              disabled={
                formData.status === "active" || formData.status === "cancelled"
                  ? true
                  : false
              }
              type="date"
              name="createdDate"
              value={toDateInputValue(formData.createdDate)}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Start Date</label>
            <input
              disabled={
                formData.status === "active" || formData.status === "cancelled"
                  ? true
                  : false
              }
              type="date"
              name="startDate"
              value={toDateInputValue(formData.startDate)}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div
            className={
              formData.status === "active" || formData.status === "cancelled"
                ? ""
                : "hidden"
            }
          >
            <label className="block text-sm mb-1">Cancel Date</label>
            <input
              disabled={formData.status === "cancelled" ? true : false}
              type="date"
              name="cancelDate"
              value={toDateInputValue(formData.cancelDate)}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Note</label>
            <textarea
              disabled={formData.status === "cancelled" ? true : false}
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows={2}
            />
          </div>
        </div>
      </>
    );
  };
  
  const paymentList = (payment) => {
    return (
      <>
        <h3 className="mt-4 font-bold border-t pt-4">Payments history</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Payment Method</th>
                <th className="px-4 py-3 text-left">Due Amount</th>
                <th className="px-4 py-3 text-left">Due Date</th>
                <th className="px-4 py-3 text-left">Actual Amount </th>
                <th className="px-4 py-3 text-left">Actual Date</th>
                <th className="px-4 py-3 text-center">Confirm</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {payment.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">{p.method}</td>
                  <td className="px-4 py-3 max-w-50">{p.dueAmount}</td>
                  <td className="px-4 py-3">{toDateInputValue(p.dueDate)}</td>
                  <td className="px-4 py-3">{p.actualAmount}</td>
                  <td className="px-4 py-3">
                    {toDateInputValue(p.actualDate)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleOpenPaymentModal(p)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {p.actualAmount ? (
                        <CheckSquare2 className="w-5 h-5 mx-auto" />
                      ) : (
                        <Square className="w-5 h-5 mx-auto" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-2xl font-bold">
            {isNewDonation ? "Create new donation" : "Donation detail"}
          </h3>
          <button onClick={onClose} className="text-gray-600 text-4xl">
            &times;
          </button>
        </div>
        {donorInformation(donation)}
        {donationInformation(donation)}
        {payment && payment.length ? paymentList(payment) : ""}

        <div className="flex justify-end gap-2 mt-4 border-t pt-4">
          {!formData.status == "cancelled" && (
            <button
              onClick={handleSave}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer"
            >
              <Save className="mr-2" /> Save donation
            </button>
          )}
          {formData.status == "draft" && (
            <button
              onClick={handleActivate}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer"
            >
              <Send className="mr-2" /> Activate Donation
            </button>
          )}

          {formData.status == "active" && (
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer"
            >
              <Trash className="mr-2" /> Cancel Donation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationDetailModal;
