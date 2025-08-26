import { extractBill } from "../utils/billExtractor.js";
import { addExpense } from "../controllers/expense.js";
import fs from "fs/promises";
import moment from "moment";

export const billUpload = async (req, res) => {
    try {
        const imagePath = req.file.path;
        console.log("Uploaded file path:", imagePath);

        if (!imagePath) {
            return res.status(400).json({ message: "Image not found" });
        }

        const extractedData = await extractBill(imagePath);
        console.log("Raw Extracted Bill Data:", extractedData);

        const cleanedResponse = extractedData.replace(/```json\n|```/g, "").trim();
        const billDataArray = JSON.parse(cleanedResponse);

        const billData = billDataArray[0];
        if (!billData) {
            throw new Error("No bill data extracted. Check the response format.");
        }

        const cleanAmount = parseFloat(billData["Total Amount"].replace(/\s/g, ""));

        const formattedDate = moment(billData["Bill Date"], "DD/MM/YY").isValid()
            ? moment(billData["Bill Date"], "DD/MM/YY").toISOString()
            : new Date().toISOString();

        const expenseData = {
            title: billData["Vendor Name"] || "Unknown Vendor",
            amount: cleanAmount || 0,
            category: billData["Category of the Expense"] || "Other",
            description: billData["Type of the Expense"] || "General",
            date: formattedDate,
        };

        await fs.unlink(imagePath);
        console.log("Deleted file:", imagePath);

        const fakeReq = {
            body: expenseData,
            userId: req.userId,
        };

        const fakeRes = {
            status: (code) => ({
                json: (data) => {
                    console.log("Expense Add Response:", data);
                    res.status(code).json(data);
                },
            }),
        };

        await addExpense(fakeReq, fakeRes);
    } catch (error) {
        console.error("Error while uploading bill:", error.message);
        return res
            .status(500)
            .json({ message: "Error while extracting bill data", error: error.message });
    }
};
