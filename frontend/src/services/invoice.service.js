const invoiceService = {
  getInvoices: async (params) => {
    try {
      console.log("Fetching invoices with params:", params);

      return {
        content: [
          {
            id: 1,
            invoiceNumber: "INV-2023-001",
            studentName: "Nguyễn Văn A",
            roomNumber: "A101",
            amount: 1500000,
            status: "PAID",
            dueDate: "2023-05-15",
            createdDate: "2023-05-01",
          },
        ],
        totalElements: 25,
        totalPages: 5,
        size: 5,
        number: 0,
      };
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  },

  getInvoiceById: async (id) => {
    try {
      console.log("Fetching invoice with ID:", id);

      return {
        id: id,
        invoiceNumber: `INV-2023-00${id}`,
        studentName: "Nguyễn Văn A",
        roomNumber: "A101",
        amount: 1500000,
        status: "PAID",
        dueDate: "2023-05-15",
        createdDate: "2023-05-01",
        details: [
          { description: "Tiền phòng", amount: 1200000 },
          { description: "Tiền điện", amount: 200000 },
          { description: "Tiền nước", amount: 100000 },
        ],
      };
    } catch (error) {
      console.error(`Error fetching invoice with ID ${id}:`, error);
      throw error;
    }
  },

  updateInvoiceStatus: async (id, status) => {
    try {
      console.log(`Updating invoice ${id} status to ${status}`);

      return { success: true };
    } catch (error) {
      console.error(`Error updating invoice ${id} status:`, error);
      throw error;
    }
  },

  createInvoice: async (invoiceData) => {
    try {
      console.log("Creating invoice with data:", invoiceData);

      return {
        id: Math.floor(Math.random() * 1000),
        ...invoiceData,
        invoiceNumber: `INV-2023-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        createdDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  },
};

export default invoiceService;
