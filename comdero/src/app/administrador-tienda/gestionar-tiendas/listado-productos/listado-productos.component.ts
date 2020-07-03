import {Component, OnDestroy, OnInit} from '@angular/core';




interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}




@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css'],

})
export class ListadoProductosComponent implements OnInit {



 public COUNTRIES= [
    {
      name: 'Russia',
      flag: 'f/f3/Flag_of_Russia.svg',
      area: 17075200,
      population: 146989754
    },
    {
      name: 'Canada',
      flag: 'c/cf/Flag_of_Canada.svg',
      area: 9976140,
      population: 36624199
    },
    {
      name: 'United States',
      flag: 'a/a4/Flag_of_the_United_States.svg',
      area: 9629091,
      population: 324459463
    },
    {
      name: 'China',
      flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
      area: 9596960,
      population: 1409517397
    },
   {
     name: 'China',
     flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
     area: 9596960,
     population: 1409517397
   },
   {
     name: 'China',
     flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
     area: 9596960,
     population: 1409517397
   },
   {
     name: 'China',
     flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
     area: 9596960,
     population: 1409517397
   },
   {
     name: 'China',
     flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
     area: 9596960,
     population: 1409517397
   },
   {
     name: 'China',
     flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
     area: 9596960,
     population: 1409517397
   }
  ];

  public busqueda

  page = 1;
  pageSize = 4;

  banderaTabla: boolean = true;

  constructor() {
    this.result=this.COUNTRIES;
  }

   search(text: string): Country[] {
    return this.COUNTRIES.filter(country => {
      const term = text.toLowerCase();
      return country.name.toLowerCase().includes(term)  // || siguiente
    });
  }

  ngOnInit() {
  }

  public result;

  async busquedasasd() {

    this.result = await this.search(this.busqueda);
  }

}
