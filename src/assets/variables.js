export const URL =
  "https://script.google.com/macros/s/AKfycbwvdVwKdj9tpTEi2DCmgAtFvXz3kCaPoCb_FXKNwsqnKoj7ZP6SycnUjFOIK91fIp0g/exec";

export const paymentMethods = [
  { value: "a_ACH", name: "ACH (Autopay)" },
  { value: "m_ACH", name: "ACH (Manual)" },
  { value: "m_cash", name: "Cash" },
  { value: "m_cashApp", name: "Cash App" },
  { value: "m_check", name: "Check" },
  { value: "m_facebook", name: "Facebook" },
  { value: "a_givelify", name: "Givelify (Autopay)" },
  { value: "m_givelify", name: "Givelify (Manual)" },
  { value: "a_gofundme", name: "GoFundMe (Autopay)" },
  { value: "m_gofundme", name: "GoFundMe (Manual)" },
  { value: "a_paypal", name: "Paypal (Autopay)" },
  { value: "m_paypal", name: "Paypal (Manual)" },
  { value: "a_other", name: "Other (Autopay)" },
  { value: "m_other", name: "Other (Manual)" },
];

export const donationTemplate = {
  id: "",
  createdBy: "",
  name: "",
  bizName: "",
  title: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  email: "",
  amount: "",
  frequency: "",
  paymentMethod: "",
  createdDate: new Date(),
  startDate: "",
  cancelledDate:"",
  note: "",
  status: "",
};
