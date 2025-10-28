import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

export const useSimplePdfExport = () => {
  const exportToPdf = async (element, filename = "transparency-report.pdf") => {
    try {
      const dataUrl = await domtoimage.toPng(element, {
        quality: 1,
        bgcolor: "#ffffff",
        cacheBust: true,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          backgroundColor: "#ffffff",
        },
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
      const imgWidth = img.width * ratio;
      const imgHeight = img.height * ratio;

      pdf.addImage(img, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(filename);

      console.log("PDF generated successfully!");
      return true;
    } catch (error) {
      console.error("PDF generation error:", error);
      return false;
    }
  };

  return { exportToPdf };
};
