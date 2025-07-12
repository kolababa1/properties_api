export default function validatePhone(phone) {
  // Example: valid if it’s all digits and 10-15 characters long
  return /^\d{10,15}$/.test(phone);
}
