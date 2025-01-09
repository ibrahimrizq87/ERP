import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  // exportToPDF() {
  //   const container = document.querySelector('.container') as HTMLElement; // The HTML element to export
  
  //   if (!container) {
  //     console.error('Container not found!');
  //     return;
  //   }
  
  //   html2canvas(container).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const pageHeight = pdf.internal.pageSize.getHeight();
  
  //     const imgWidth = pageWidth;
  //     const imgHeight = (canvas.height * pageWidth) / canvas.width;
  
  //     let y = 0; // Start position on the PDF page
  
  //     if (imgHeight <= pageHeight) {
  //       // If content fits on a single page
  //       pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
  //     } else {
  //       // Split content across multiple pages
  //       let position = 0;
  
  //       while (position < canvas.height) {
  //         const croppedCanvas = document.createElement('canvas');
  //         const croppedCanvasCtx = croppedCanvas.getContext('2d');
  //         const visibleHeight = (canvas.width * pageHeight) / pageWidth;
  
  //         croppedCanvas.width = canvas.width;
  //         croppedCanvas.height = visibleHeight;
  
  //         croppedCanvasCtx?.drawImage(
  //           canvas,
  //           0,
  //           position,
  //           canvas.width,
  //           visibleHeight,
  //           0,
  //           0,
  //           croppedCanvas.width,
  //           croppedCanvas.height
  //         );
  
  //         const croppedImgData = croppedCanvas.toDataURL('image/png');
  //         pdf.addImage(croppedImgData, 'PNG', 0, y, imgWidth, pageHeight);
  
  //         position += visibleHeight;
  
  //         if (position < canvas.height) {
  //           pdf.addPage();
  //         }
  //       }
  //     }
  
  //     pdf.save('financial-report.pdf');
  //   }).catch((error) => {
  //     console.error('Error creating PDF:', error);
  //   });
  // }

  exportToPDF(): void {
    const content: HTMLElement | null = document.getElementById('invoice-details');
    if (content) {
      html2canvas(content).then((canvas: { toDataURL: (arg0: string) => any; height: number; width: number; }) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190; 
        const pageHeight = 297; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('test.pdf');
      });
    }
  }
}  