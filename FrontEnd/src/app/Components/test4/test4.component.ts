import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportsService } from '../../shared/services/reports.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-test4',
  imports: [],
  templateUrl: './test4.component.html',
  styleUrl: './test4.component.css'
})
export class Test4Component implements OnInit {
  // { id: '1', message: 'النقدية و ما فى حكمها' },
  // { id: '2', message: 'مخزون' },
  // { id: '3', message: 'الذمم المدينة التجارية' },
  // { id: '4', message: 'مصروفات مدفوعة مقدما' },
  // { id: '5', message: 'ارصدة مدينة التجارية' },
  // { id: '6', message: 'اصراف ذات علاقة مدينة' },
  // { id: '7', message: 'ممتلكات و ألات و معدات صافى' },
  // { id: '8', message: 'مشروعات تحت التنفيذ' },
  // { id: '9', message: 'ذمم دائنة تجارية' },
  // { id: '10', message: 'اطراف ذات علاقة دائنة' },
  // { id: '11', message: 'ارصدة دائنة اخرى' },
  // { id: '13', message: 'المصروفات المستحقة' },
  // { id: '14', message: 'قروض طويلة الاجل' },
  // { id: '15', message: 'رأس المال' },
  // { id: '16', message: 'جارى الشركاء' },
  // { id: '17', message: 'ارباح العام' },
  // { id: '18', message: 'صافى الايرادات التشغيلية' },
  // { id: '19', message: 'تكلفة الايرادات' },
  // { id: '20', message: 'التكاليف التشغيلية' },
  // { id: '21', message: 'مصاريف بيع و توزيع' },
  // { id: '22', message: 'مخصص اهلاك الاصول الثابته' },
  // { id: '23', message: 'مصاريف ادارية و عمومية' },
  // { id: '24', message: 'ايرادات اخرى' },
  // { id: '25', message: 'الزكاة التقديرية' },
  // { id: '26', message: 'صافى الايرادات التشخيلية' },
  // { id: 'none', message: 'نوع اخر' }
  currentYear: number = 0;
  report: any[] = []; 
  id1: number = 0;
  id2: number = 0;
  id3: number = 0;
  id4: number = 0;
  id5: number =0;
  id6: number=0;
  assetsSum: number = 0;
 
  id7: number = 0;
  id8: number = 0;
  notAssetsSum: number = 0;
  allAssetsSum: number = 0;


  id9: number = 0;
  id10: number = 0;
  id11: number =0;
  id13: number=0;
  requirmentsSum:number=0;

  id14: number=0;
  notRequirmentsSum:number=0;

  allRequirmentsSum:number=0;

  id15:number=0;
  id16:number=0;
  id17:number=0;

  partnersSum:number=0;
  partnersAndRequirmentsSum:number=0;
  // main_activities:number=0;
  // id24: number = 0;
  // net_income:number=0;
  // id25:number=0;
  // final_net_income:number=0;
  constructor(
  
    private _ReportsService:ReportsService
    , private router: Router,
    private toastr :ToastrService
  ) {}
  ngOnInit(): void {
    
    this.getCurrentYear(); 
    this.loadAllequationHistory()
  }
  loadAllequationHistory(): void {
    this._ReportsService.yearReport().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.report = response.data; 
          const item1 = this.report.find((item) => item.id === '1');
          this.id1 = item1 ? item1.value :0;

          const item2 = this.report.find((item) => item.id === '2');
          this.id2 = item2 ? item2.value :0;
          
          const item3 = this.report.find((item) => item.id === '3');
          this.id3 = item3 ? item3.value :0;

          const item4 = this.report.find((item) => item.id === '4');
          this.id4 = item4 ? item4.value :0;

          const item5 = this.report.find((item) => item.id === '5');
          this.id5 = item5 ? item5.value :0;

          const item6 = this.report.find((item) => item.id === '6');
          this.id6 = item6 ? item6.value :0;

          this.assetsSum = this.id1 + this.id2+ this.id3+ this.id4 +this.id5 +this.id6;

          const item7 = this.report.find((item) => item.id === '7');
          this.id7 = item7 ? item7.value :0;

          const item8 = this.report.find((item) => item.id === '8');
          this.id8 = item8 ? item8.value :0;

          this.notAssetsSum =this.id7+this.id8;
          this.allAssetsSum=this.assetsSum+this.notAssetsSum

          const item9= this.report.find((item) => item.id === '9');
          this.id9 = item9 ? item9.value :0;

          const item10= this.report.find((item) => item.id === '10');
          this.id10 = item10 ? item10.value :0;

          const item11= this.report.find((item) => item.id === '11');
          this.id11 = item11 ? item11.value :0;

          const item13= this.report.find((item) => item.id === '13');
          this.id13 = item13 ? item13.value :0;

          this.requirmentsSum=this.id9+this.id10+this.id11+this.id13

          const item14= this.report.find((item) => item.id === '14');
          this.id14 = item14 ? item14.value :0;

          this.notRequirmentsSum=this.id14
          this.allRequirmentsSum=this.requirmentsSum+this.notRequirmentsSum

          const item15= this.report.find((item) => item.id === '15');
          this.id15 = item15 ? item14.value :0;

          const item16= this.report.find((item) => item.id === '16');
          this.id16 = item16 ? item16.value :0;

          const item17= this.report.find((item) => item.id === '17');
          this.id17 = item17 ? item17.value :0;

          this.partnersSum=this.id15+ this.id16+ this.id17;
          this.partnersAndRequirmentsSum=this.allRequirmentsSum+this.partnersSum
          // const item3 = this.report.find((item) => item.id === '20');
          // this.id20 = item3 ? item3.value :0;

          // const item4 = this.report.find((item) => item.id === '21');
          // this.id21 = item4 ? item4.value :0;

          // const item5 = this.report.find((item) => item.id === '22');
          // this.id22 = item5 ? item5.value :0;

          // const item6 = this.report.find((item) => item.id === '23');
          // this.id23 = item6 ? item6.value :0;

          // this.main_activities=this.id20+this.id21+this.id22+this.id23;

          // const item7 = this.report.find((item) => item.id === '24');
          // this.id24 = item7 ? item7.value :0;

          // this.net_income=this.main_activities+this.id24

          // const item8 = this.report.find((item) => item.id === '25');
          // this.id25 = item8 ? item8.value :0;

          // this.final_net_income=this.net_income+this.id25
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 
    getCurrentYear(): void {
      const now = new Date();
      this.currentYear = now.getFullYear();
    }
   
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

        pdf.save('test4.pdf');
      });
    }
  }
}
