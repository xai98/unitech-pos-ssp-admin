import * as XLSX from 'xlsx';

export const downloadExcel = async (titles:any, rows:any, fileName:any) => {
    try {
        /* generate worksheet and workbook */
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

        /* fix headers */
        XLSX.utils.sheet_add_aoa(worksheet, [titles], { origin: "A1" });

        /* create an XLSX file and try to save to xlsx file */
        XLSX.writeFile(workbook, fileName);
    } catch (error) {
        console.log("error: ", error);
    }
}
