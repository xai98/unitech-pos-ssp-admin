// src/types/order.ts
export interface Order {
    id?:string,
    no: number;           // ลำดับ (อาจเป็น string หรือ number ขึ้นอยู่กับข้อมูลจริง)
    createdAt: string;            // วันที่สร้าง (ใช้ string เพราะรับ date ในรูปแบบ ISO string)
    order_no: string;             // เลขบิล
    typePay: string;              // ประเภทการชำระเงิน
    total_price: number;          // ราคารวมทั้งหมด
    discount_total: number;       // ส่วนลดทั้งหมด
    final_receipt_total: number;  // รับตัวจริง (ยอดหลังหักส่วนลด)
    cash_lak: number;             // รับเงินสด (กีบ)
    transfer_lak: number;         // รับเงินโอน (กีบ)
    send_back_customer: number;   // เงินทอน
    createdBy: string;            // ผู้ทำรายการ
  }