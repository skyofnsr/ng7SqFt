import { Component } from '@angular/core';
import { setClassMetadata } from '@angular/core/src/render3';
import { FloormapdataService } from './floormapdata.service';

//Component decorator
@Component({
    selector: 'seat-list',
    templateUrl: './seat.component.html',
    styleUrls: ['./seat.component.scss']
    // ,
    // providers: [FloormapdataService]
})
export class SeatComponent {
    //variable declarations
    movieTitle:string = "Welcome to Square Feet Solution!";
    screen: string = "BookIt";
    time: string = "FRI, 6:45PM"

    Zoom_Idx :number = 5;
    Zoom_Idx_MAX : number = 10;
    
    stRows: number;
    stCols: number;

    reserved: string[] = [ '1019C'];
    selected: string[] = [];

    ticketPrice: number = 120;
    convFee: number = 30;
    totalPrice: number = 0;
    currency: string = "Rs"; 
    
    seats = new Array(Array());
    
    constructor( private floormap : FloormapdataService ) { }

    ngOnInit() {
        this.seats = this.floormap.seats;
        this.stCols = this.seats.length;
        this.stRows = this.seats[0].length;
        console.log('Rows # : ' + this.stCols);
        console.log('Columns # : ' +this.stRows);
    }
  
    //return status of each seat
    getStatus = function( x: number, y: number) {
        var seatPos: string;
        seatPos = this.seats[x][y];
        if(this.reserved.indexOf(seatPos) !== -1) {
            return 'reserved';
        } else if(this.selected.indexOf(seatPos) !== -1) {
            return 'selected';
        } else if(seatPos.length > 2) {
            return 'freeSeat';
        } else if (x > 0 && x < (this.stCols-1) && y > 0 && y < (this.stRows-1) && this.seats[x][y].length > 2) {
            if (this.seats[x][y] === this.seats[x][y-1]  || 
                this.seats[x][y] === this.seats[x][y+1]  ||
                this.seats[x][y] === this.seats[x-1][y]  ||
                this.seats[x][y] === this.seats[x+1][y] )
            return 'cabin'; }

          else return 'noSeat';

        }

    getZoom_Idx = function(x:number){
        if (x === 0) this.Zoom_Idx = this.Zoom_Idx_MAX/2;
        else if (x*x === 1) this.Zoom_Idx =  this.Zoom_Idx + x;
        
        if(this.Zoom_Idx < 0) this.Zoom_Idx = 0;  
        else if (this.Zoom_Idx > this.Zoom_Idx_MAX)  this.Zoom_Idx = this.Zoom_Idx_MAX;
    }
    

    //clear handler
    clearSelected = function() {
        this.selected = [];
    }
    //click handler
    seatClicked = function (seatPos: string) {
        var index = this.selected.indexOf(seatPos);

        if (seatPos.length > 2) {
            if (index !== -1) {
                // seat already selected, remove
                this.selected.splice(index, 1)
            } else {
                //push to selected array only if it is not reserved
                if (this.reserved.indexOf(seatPos) === -1)
                    this.selected.push(seatPos);
            }
        }
    }
    //Buy button handler
    showSelected = function() {
        if(this.selected.length > 0) {
            alert("Selected Seats: " + this.selected + "\nTotal: "+(this.ticketPrice * this.selected.length + this.convFee));
        } else {
            alert("No seats selected!");
        }
    }




cabinCellsHide =function( x: number, y: number){
    if (x > 0 && x < (this.stCols-1) && y > 0 && y < (this.stRows-1) && this.seats[x][y].length > 2) {
        if (
            this.seats[x][y] !== this.seats[x - 1][y] &&
            this.seats[x][y] === this.seats[x + 1][y] &&
            this.seats[x][y] !== this.seats[x][y - 1] &&
            this.seats[x][y] === this.seats[x][y + 1]
        ) return 'cabin'; 
        else if (this.seats[x][y] === this.seats[x][y-1]  || 
            this.seats[x][y] === this.seats[x][y+1]  ||
            this.seats[x][y] === this.seats[x-1][y]  ||
            this.seats[x][y] === this.seats[x+1][y] )
        return 'hidden';     
    }
}

    getCabinColor = function (x: number, y: number) {
        if (x > 0 && x < (this.stCols - 1) && y > 0 && y < (this.stRows - 1) && this.seats[x][y].length > 2) 
            
        if (this.seats[x][y].indexOf('Lift') !== -1)
            return 'hotpink';
        else if (this.seats[x][y].indexOf('Washroom') !== -1)
        return 'lightskyblue';
        else if (this.seats[x][y].indexOf('Staircase') !== -1)
        return 'gold';
        else if (this.seats[x][y].indexOf('Pantry') !== -1)
        return 'lightGreen';
        
        
        
        else 
            if (
                this.seats[x][y] === this.seats[x - 1][y] ||
                this.seats[x][y] === this.seats[x + 1][y] ||
                this.seats[x][y] === this.seats[x][y - 1] ||
                this.seats[x][y] === this.seats[x][y + 1]
            ) return 'lightgray';


            // if (this.this.seats[x][y].indexOf('lift') !== -1)
            //         return 'blue';
            //     else     
            //         return 'lightgray';
        }




    //get the cabe map
    getCellsBdrCss = function (x: number, y: number) {
        if ( x== 0 && y === 0 ) return 'stBd_top stBd_left';
        else if (x === 0 && y == this.stRows - 1) return 'stBd_top stBd_right';
        else if (x === 0) return 'stBd_top';
        else if (y === 0 && x == this.stCols - 1) return 'stBd_left stBd_bottom';
        else if (y === 0 ) return 'stBd_left';

        if ( x == this.stCols - 1 && y === this.stRows -1 ) return 'stBd_bottom stBd_right';
        else if (x === this.stCols-1) return 'stBd_bottom';
        else if (y === this.stRows-1) return 'stBd_right';

        if (x > 0 && x < (this.stCols-1) && y > 0 && y < (this.stRows-1) && this.seats[x][y].length > 2) {
            if (
                this.seats[x][y] !== this.seats[x - 1][y] &&
                this.seats[x][y] !== this.seats[x + 1][y] &&
                this.seats[x][y] !== this.seats[x][y - 1] &&
                this.seats[x][y] !== this.seats[x][y + 1]
            )
                return 'stBd_top stBd_left stBd_bottom stBd_right ';
            else if (
                this.seats[x][y] !== this.seats[x - 1][y] &&
                this.seats[x][y] === this.seats[x + 1][y] &&
                this.seats[x][y] !== this.seats[x][y - 1] &&
                this.seats[x][y] === this.seats[x][y + 1]
            )
            return 'stBd_top stBd_left';
            else if (
                this.seats[x][y] !== this.seats[x - 1][y] &&
                this.seats[x][y] === this.seats[x + 1][y] &&
                this.seats[x][y] === this.seats[x][y - 1] &&
                this.seats[x][y] !== this.seats[x][y + 1]
            )
            return 'stBd_top stBd_right stTextforCabin';
            else if (
                this.seats[x][y] === this.seats[x - 1][y] &&
                this.seats[x][y] !== this.seats[x + 1][y] &&
                this.seats[x][y] !== this.seats[x][y - 1] &&
                this.seats[x][y] === this.seats[x][y + 1]
            )
            return 'stBd_bottom stBd_left stTextforCabin';
            else if (
                this.seats[x][y] === this.seats[x - 1][y] &&
                this.seats[x][y] !== this.seats[x + 1][y] &&
                this.seats[x][y] === this.seats[x][y - 1] &&
                this.seats[x][y] !== this.seats[x][y + 1]
            )
            return 'stBd_bottom stBd_right stTextforCabin';
            
            else if (
                this.seats[x][y] === this.seats[x - 1][y] &&
                this.seats[x][y] === this.seats[x + 1][y] &&
                this.seats[x][y] !== this.seats[x][y - 1] &&
                this.seats[x][y] === this.seats[x][y + 1]
            )
            return 'stBd_left stTextforCabin';
            else if (
                this.seats[x][y] === this.seats[x - 1][y] &&
                this.seats[x][y] === this.seats[x + 1][y] &&
                this.seats[x][y] === this.seats[x][y - 1] &&
                this.seats[x][y] !== this.seats[x][y + 1]
            )
            return 'stBd_right stTextforCabin';
            else if (
                this.seats[x][y] !== this.seats[x - 1][y] &&
                this.seats[x][y] === this.seats[x + 1][y] &&
                this.seats[x][y] === this.seats[x][y - 1] &&
                this.seats[x][y] === this.seats[x][y + 1]
            )
            return 'stBd_top stTextforCabin';
            else if (
                this.seats[x][y] === this.seats[x - 1][y] &&
                this.seats[x][y] !== this.seats[x + 1][y] &&
                this.seats[x][y] === this.seats[x][y - 1] &&
                this.seats[x][y] === this.seats[x][y + 1]
            )
            return 'stBd_bottom stTextforCabin';
            else if (
                this.seats[x][y] === this.seats[x - 1][y] &&
                this.seats[x][y] === this.seats[x + 1][y] &&
                this.seats[x][y] === this.seats[x][y - 1] &&
                this.seats[x][y] === this.seats[x][y + 1]
            )
            return 'stTextforCabin';
        }   
    }
    
   
}