import { Component, ViewChild,OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, fromEvent, merge, Subscription, tap } from 'rxjs';

interface USER {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  reg_date: string;
}

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit,AfterViewInit,OnDestroy {
  ELEMENT_DATA: USER[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  sortKey:string = 'id';
  sortDirection:string = 'desc';
  filterText:string = '';
  allSubscriptions:Subscription[] = [];

  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email', 'reg_date'];
  dataSource: MatTableDataSource<USER> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    let searchSub = fromEvent(this.input.nativeElement,'keyup').pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
            this.paginator.pageIndex = 0;
            this.filterText = this.input.nativeElement.value;
            this.loadData(0,this.pageSize,this.filterText,this.sortKey,this.sortDirection);
        })
    ).subscribe();
  this.allSubscriptions.push(searchSub);

  let sortSub = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  let mergeSub = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => {
        this.currentPage = this.paginator.pageIndex,
        this.pageSize =  this.paginator.pageSize;
        this.sortDirection = this.sort.direction;
        this.sortKey = this.sort.active;
        this.loadData(this.paginator.pageIndex,this.paginator.pageSize,this.filterText,this.sortKey,this.sortDirection);
    } )).subscribe();

    this.allSubscriptions.push(sortSub);
    this.allSubscriptions.push(mergeSub);
  }


  ngOnInit(): void {
    this.loadData(this.currentPage,this.pageSize,this.filterText,this.sortKey,this.sortDirection);
  }

  loadData(currentPage:number,pageSize:number,filterText:string,sortKey:string,sortDirection:string) {
    this.isLoading = true;
    let URL = `http://localhost/phpapi/api.php?pageno=${currentPage}&per_page=${pageSize}&search=${filterText}&sortBy=${sortKey}&sortDirection=${sortDirection}`;

    fetch(URL)
      .then(response => response.json())
      .then(data => {
        setTimeout(() => {
          this.dataSource.data = data.rows;
          this.paginator.pageIndex = currentPage;
          //this.paginator.length = data.count;
          this.totalRows = data.count;
          this.isLoading = false;
        },2000);
      }, error => {
        console.log(error);
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
      this.allSubscriptions.length && this.allSubscriptions.forEach(x=>{
        x.unsubscribe();
      })
  }


}
