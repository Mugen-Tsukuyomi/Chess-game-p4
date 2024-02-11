let boxes = document.querySelectorAll('.boxes');
let turntxt = document.querySelector('.turn');
let movebackbtn = document.getElementById("movebackbtn");
let resetbtn = document.getElementById("resetbtn");
let deadB = document.querySelectorAll('.deadB');
let deadW = document.querySelectorAll('.deadW');
let movesound = new Audio(src="Move.mp3");
let capturesound = new Audio(src="Capture.mp3");
let turn = "W";
let moves = [];
let Wkingmove = 0;
let Bkingmove = 0;
let kingmovebox;
let kingmoveboxinnertext;
let checkmatedirection;
let checkvalue;
let numberofchecks;
let availablemove = [];
let Wrightrookmove = 0; let Wleftrookmove = 0;
let Brightrookmove = 0; let Bleftrookmove = 0;
let value = "*";
let kingavailablemoves = [];
let passant; let pawnid; let pawnrow; let pawncolumn; 
let promotiondiv = document.querySelector('.promotiondiv'); let promo = false;
let divs = document.querySelectorAll('.divs');
let whiteMins = document.getElementById("whitemins"); let whiteSecs = document.getElementById("whitesecs");
let blackMins = document.getElementById("blackmins"); let blackSecs = document.getElementById("blacksecs");
let bStartTime; let wStartTime; let timeBoxes=document.querySelectorAll('.timebox'); let choosetimebox=document.getElementById('choosetime');
let lowtimesound = new Audio(src="LowTime.mp3"); let victorySound = new Audio(src="GenericNotify.mp3");
let rightsidesection = document.querySelector('.rightsidesection');

// images inserting function

function insertimages(){
    for(let box of boxes){
        if(box.innerText !== ""){
            box.innerHTML = `<img src="${box.innerText}.png">${box.innerText}</img>`
        }
    }
    for(let box of deadB){
        if(box.innerText !== ""){
            box.innerHTML = `<img src="${box.innerText}.png">${box.innerText}</img>`
        }
    }
    for(let box of deadW){
        if(box.innerText !== ""){
            box.innerHTML = `<img src="${box.innerText}.png">${box.innerText}</img>`
        }
    }
    for(let box of divs){
        if(box.innerText !== ""){
            box.innerHTML = `<img src="${box.innerText}.png">${box.innerText}</img>`
        }
    }
};

insertimages();

// coloring function

function coloring(){
    for(let box of boxes){
        let boxid = Array.from(box.id);
        let boxrow = eval(boxid.shift());
        let boxcolumn = eval(boxid.pop());
        if((boxrow + boxcolumn) % 2 !== 0){
            box.style.backgroundColor = "burlywood";
        }else{box.style.backgroundColor = "#9d6e3f";}
    }
    checkmate();
    //"burlywood"
    //"lightseagreen"
    //"#9d6e3f"
};

coloring();

//________________________game function__________________________//

for(let box of boxes){
    let boxid = Array.from(box.id);
    let boxrow = eval(boxid.shift());
    let boxcolumn = eval(boxid.pop());
    box.addEventListener("mousedown", function(){
        // selection
        if(box.innerText.length !== 0 && turn == "W"){
            
                if(box.textContent.includes(turn)&&box.style.backgroundColor!=="cadetblue"&&box.style.backgroundColor!=="red"&&box.style.backgroundColor!=="darkred"){
                    coloring();
                    box.style.backgroundColor="cadetblue";
                    availablemoves(boxrow,boxcolumn);
                    showmoves(boxrow,boxcolumn);
                }
                else if(box.textContent.includes(turn) && box.style.backgroundColor=="red"){
                    coloring();
                    availablemoves(boxrow,boxcolumn);
                    showmoves(boxrow,boxcolumn);
                    box.style.backgroundColor="darkred";
                }
                else if(box.textContent.includes("B") && box.style.backgroundColor!=="lightseagreen"){
                    coloring();
                }
                //capturing
                else if(box.textContent.includes("B") && box.style.backgroundColor=="lightseagreen"){
                    capture(box);
                }
                else if(box.style.backgroundColor=="cadetblue" || box.style.backgroundColor=="darkred"){
                    if(dragged==true){
                        dragged=false;
                    }
                    else{coloring();}
                }
                if(turntxt.innerText == "Draw game!"){coloring();}
            
        }
        // selection
        else if(box.innerText !== "" && turn == "B"){
            
                if(box.textContent.includes(turn)&&box.style.backgroundColor!=="cadetblue"&&box.style.backgroundColor!=="red"&&box.style.backgroundColor!=="darkred"){
                    coloring();
                    box.style.backgroundColor="cadetblue";
                    availablemoves(boxrow,boxcolumn);
                    showmoves(boxrow,boxcolumn);
                }
                else if(box.textContent.includes(turn) && box.style.backgroundColor=="red"){
                    coloring();
                    availablemoves(boxrow,boxcolumn);
                    showmoves(boxrow,boxcolumn);
                    box.style.backgroundColor="darkred";
                }
                else if(box.textContent.includes("W") && box.style.backgroundColor!=="lightseagreen"){
                    coloring();
                }
                //capturing
                else if(box.textContent.includes("W") && box.style.backgroundColor=="lightseagreen"){
                    capture(box);
                }
                else if(box.style.backgroundColor=="cadetblue" || box.style.backgroundColor=="darkred"){
                    if(dragged==true){
                        dragged=false;
                    }
                    else{coloring();}
                }
                if(turntxt.innerText == "Draw game!"){coloring();}
            
        }
        // moving code
        else if(box.innerText == ""){
            
                if(box.style.backgroundColor=="lightseagreen"){
                    move(box);
                }
                else if(box.style.backgroundColor!=="lightseagreen"){
                    coloring();
                }
            
        }
    })    
};

//------------------------------------------------------------------//

//function for capturing

function capture(target){
    passant=0;
    for(let i of boxes){
        if(i.style.backgroundColor=="cadetblue" || i.style.backgroundColor=="darkred"){
            let capturearray = [];
            if(target.textContent.includes("B") && turn == "W"){
                if(i.innerText=="Wking"){
                    Wkingmove +=1;
                }
                if(i.id == "1_8" && i.innerText == "Wrook"){
                    Wrightrookmove +=1;
                }
                if(i.id =="1_1" && i.innerText == "Wrook"){
                    Wleftrookmove +=1;
                }
                if(i.innerText=="Wpawn"&&target.id.includes("8_")){ // promotion
                    promotion(target);
                    let pawntxtarray = ["Wpawn"];
                    moves.push(pawntxtarray);
                }
                for(let p of deadB){
                    if (p.innerText==""){
                        p.innerText=target.innerText;
                        capturearray.push(p);
                        break;
                    }
                };
                if(promo!=true){
                    turn = "B";
                    turntxt.innerText = "Black's Turn";
                    turntxt.style.color = "black";
                    wStartTime=[whiteMins.innerText,whiteSecs.innerText]
                }
            }
            else if(target.textContent.includes("W") && turn == "B"){
                if(i.innerText=="Bking"){
                    Bkingmove +=1;
                }
                if(i.id == "8_8" && i.innerText=="Brook"){
                    Brightrookmove +=1;
                }
                if(i.id =="8_1" && i.innerText=="Brook"){
                    Bleftrookmove +=1;
                }
                if(i.innerText=="Bpawn"&&target.id.includes("1_")){ // promotion
                    promotion(target);
                    let pawntxtarray = ["Bpawn"];
                    moves.push(pawntxtarray);
                }
                for(let p of deadW){
                    if (p.innerText==""){
                        p.innerText=target.innerText;
                        capturearray.push(p);
                        break;
                    }
                };
                if(promo!=true){
                    turn = "W";
                    turntxt.innerText = "White's Turn";
                    turntxt.style.color = "White";
                    bStartTime=[blackMins.innerText,blackSecs.innerText]
                }
            }
            capturearray.push(i);
            target.innerText = i.innerText;
            capturearray.push(target);
            moves.push(capturearray);
            if(i.innerText.includes("king")){
                checkDraw();
            }
            i.innerText = "";
            capturesound.play();
        }
    }
    insertimages();
    coloring();
    checkWinner();
};

//moving function

function move(newplace){
    let newplacearray = [];
    for(let box of boxes){
        if(box.style.backgroundColor=="cadetblue" || box.style.backgroundColor=="darkred"){
            newplacearray.push(box);
            newplacearray.push(newplace);
            moves.push(newplacearray);
            if(box.textContent.includes("W")){
                if(box.innerText=="Wking"){
                    let castlingarray=[];
                    Wkingmove+=1;
                    if(newplace.id=="1_7"&&box.id=="1_5"&&document.getElementById("1_8").innerText=="Wrook"){ // castling
                        document.getElementById("1_6").innerText=document.getElementById("1_8").innerText;
                        document.getElementById("1_8").innerText="";
                        castlingarray.push(document.getElementById("1_6"));
                        castlingarray.push(document.getElementById("1_5"));
                        castlingarray.push(document.getElementById("1_8"));
                        castlingarray.push(document.getElementById("1_7"));
                        moves.pop();
                        moves.push(castlingarray);
                    }
                    if(newplace.id=="1_3"&&box.id=="1_5"&&document.getElementById("1_1").innerText=="Wrook"){
                        document.getElementById("1_4").innerText=document.getElementById("1_1").innerText;
                        document.getElementById("1_1").innerText="";
                        castlingarray.push(document.getElementById("1_4"));
                        castlingarray.push(document.getElementById("1_5"));
                        castlingarray.push(document.getElementById("1_1"));
                        castlingarray.push(document.getElementById("1_3"));
                        moves.pop();
                        moves.push(castlingarray);
                    }
                }
                if(box.id == "1_8" && box.innerText == "Wrook"){
                    Wrightrookmove +=1;
                }
                if(box.id =="1_1" && box.innerText == "Wrook"){
                    Wleftrookmove +=1;
                }
                if(box.innerText=="Wpawn" && newplace.id.includes("8_")){ // promotion
                    promotion(newplace);
                    let pawntxtarray = ["Wpawn"];
                    let move = moves.pop();
                    moves.push(pawntxtarray);
                    moves.push(move);
                }
                if(passant==1&&newplace.id==pawnrow+1+"_"+pawncolumn&&box.innerText=="Wpawn"){ // en passant
                    let pawn = document.getElementById(pawnid);
                    let capturearray = [];
                    for(let p of deadB){
                        if (p.innerText==""){
                            p.innerText=pawn.innerText;
                            capturearray.push(p);
                            break;
                        }
                    };
                    capturearray.push(box);
                    pawn.innerHTML="";
                    capturearray.push(pawn);
                    capturearray.push(document.getElementById(pawnrow+1+"_"+pawncolumn));
                    capturesound.play();
                    moves.pop();
                    moves.push(capturearray);
                }
                passant=0;
                if(box.innerText=="Wpawn"&& box.id.includes("2_") && newplace.id.includes("4_")){
                    passant=1; pawnid=newplace.id; let arrid=Array.from(pawnid); pawnrow=eval(arrid.shift()); pawncolumn=eval(arrid.pop());
                }
                newplace.innerText=box.innerText;
                box.innerText="";
                movesound.play();
                if(promo!=true){
                    turn = "B";
                    turntxt.innerText = "Black's Turn";
                    turntxt.style.color = "black";
                    wStartTime=[whiteMins.innerText,whiteSecs.innerText]
                } 
            }
            else if(box.textContent.includes("B")){
                if(box.innerText=="Bking"){
                    let castlingarray=[];
                    Bkingmove +=1;
                    if(newplace.id=="8_7"&&box.id=="8_5"&&document.getElementById("8_8").innerText=="Brook"){ // castling
                        document.getElementById("8_6").innerText=document.getElementById("8_8").innerText;
                        document.getElementById("8_8").innerText="";
                        castlingarray.push(document.getElementById("8_6"));
                        castlingarray.push(document.getElementById("8_5"));
                        castlingarray.push(document.getElementById("8_8"));
                        castlingarray.push(document.getElementById("8_7"));
                        moves.pop();
                        moves.push(castlingarray);
                    }
                    if(newplace.id=="8_3"&&box.id=="8_5"&&document.getElementById("8_1").innerText=="Brook"){
                        document.getElementById("8_4").innerText=document.getElementById("8_1").innerText;
                        document.getElementById("8_1").innerText="";
                        castlingarray.push(document.getElementById("8_4"));
                        castlingarray.push(document.getElementById("8_5"));
                        castlingarray.push(document.getElementById("8_1"));
                        castlingarray.push(document.getElementById("8_3"));
                        moves.pop();
                        moves.push(castlingarray);
                    }
                }
                if(box.id == "8_8" && box.innerText=="Brook"){
                    Brightrookmove +=1;
                }
                if(box.id =="8_1" && box.innerText=="Brook"){
                    Bleftrookmove +=1;
                }
                if(box.innerText=="Bpawn" && newplace.id.includes("1_")){ // promotion
                    promotion(newplace);
                    let pawntxtarray = ["Bpawn"];
                    let move = moves.pop();
                    moves.push(pawntxtarray);
                    moves.push(move);
                }
                if(passant==1&&newplace.id==pawnrow-1+"_"+pawncolumn&&box.innerText=="Bpawn"){  // en passant
                    let pawn = document.getElementById(pawnid);
                    let capturearray = [];
                    for(let p of deadW){
                        if (p.innerText==""){
                            p.innerText=pawn.innerText;
                            capturearray.push(p);
                            break;
                        }
                    };
                    capturearray.push(box);
                    pawn.innerHTML="";
                    capturearray.push(pawn);
                    capturearray.push(document.getElementById(pawnrow-1+"_"+pawncolumn));
                    capturesound.play();
                    moves.pop();
                    moves.push(capturearray);
                }
                passant=0;
                if(box.innerText=="Bpawn"&& box.id.includes("7_") && newplace.id.includes("5_")){
                    passant=1; pawnid=newplace.id; let arrid=Array.from(pawnid); pawnrow=eval(arrid.shift()); pawncolumn=eval(arrid.pop());
                }
                newplace.innerText=box.innerText;
                box.innerText="";
                movesound.play();
                if(promo!=true){
                    turn = "W";
                    turntxt.innerText = "White's Turn";
                    turntxt.style.color = "White";
                    bStartTime=[blackMins.innerText,blackSecs.innerText]
                }
            }
        }
    }
    insertimages();
    coloring();
    checkWinner();
};

// back moves btn function

movebackbtn.addEventListener("click", function(){
    if(moves.length !== 0){
    if(moves[moves.length-1].length == 3){
        if(promo!=true){
        let caparray = moves.pop();
        let capturedpiece = caparray.shift();
        let attackingpiece = caparray.shift();
        let capturedbox = caparray.shift();
        attackingpiece.innerText = capturedbox.innerText;
        capturedbox.innerText = capturedpiece.innerText;
        capturedpiece.innerText = "";
        insertimages();
        coloring();
        if(moves.length !== 0){
            if(moves[moves.length-1].length ==1){
                attackingpiece.innerText = moves[moves.length-1][0];
                insertimages();
                coloring();
                moves.pop();
            }                   
        }
        if(turn == "B"){
            turn = "W";
            turntxt.innerText = "White's Turn";
            turntxt.style.color = "White";
            if(attackingpiece.innerText=="Wking"){
                Wkingmove -=1
            }
            if(attackingpiece.id == "1_8" && attackingpiece.innerText=="Wrook"){
                Wrightrookmove =0
            }
            if(attackingpiece.id == "1_1" && attackingpiece.innerText=="Wrook"){
                Wleftrookmove =0
            }
            blackMins.innerText=bStartTime[0] 
            blackSecs.innerText=bStartTime[1]
        }
        else{
            turn = "B";
            turntxt.innerText = "Black's Turn";
            turntxt.style.color = "black";
            if(attackingpiece.innerText=="Bking"){
                Bkingmove -=1
            }
            if(attackingpiece.id == "8_8" && attackingpiece.innerText=="Brook"){
                Brightrookmove =0
            }
            if(attackingpiece.id == "8_1" && attackingpiece.innerText=="Brook"){
                Bleftrookmove =0
            }
            whiteMins.innerText=wStartTime[0] 
            whiteSecs.innerText=wStartTime[1]
        }
        }
    }
    else if(moves[moves.length-1].length == 2){
        if(promo!=true){
        let movarray = moves.pop();
        let oldplace = movarray.shift();
        let lastplace = movarray.shift(); 
        oldplace.innerText = lastplace.innerText;
        lastplace.innerText = "";
        insertimages();
        coloring();
        if(moves.length !== 0){
            if(moves[moves.length-1].length ==1){
                oldplace.innerText = moves[moves.length-1][0];
                insertimages();
                coloring();
                moves.pop();
            }
        }
        if(turn == "B"){
            turn = "W";
            turntxt.innerText = "White's Turn";
            turntxt.style.color = "White";
            if(oldplace.innerText=="Wking"){
                Wkingmove -=1
            }
            if(oldplace.id == "1_8" && oldplace.innerText=="Wrook"){
                Wrightrookmove =0
            }
            if(oldplace.id == "1_1" && oldplace.innerText=="Wrook"){
                Wleftrookmove =0
            }
            blackMins.innerText=bStartTime[0] 
            blackSecs.innerText=bStartTime[1]
        }
        else{
            turn = "B";
            turntxt.innerText = "Black's Turn";
            turntxt.style.color = "black"; 
            if(oldplace.innerText=="Bking"){
                Bkingmove -=1
            }
            if(oldplace.id == "8_8" && oldplace.innerText=="Brook"){
                Brightrookmove =0
            }
            if(oldplace.id == "8_1" && oldplace.innerText=="Brook"){
                Bleftrookmove =0
            }
            whiteMins.innerText=wStartTime[0] 
            whiteSecs.innerText=wStartTime[1]
        }
        }
    }
    else if(moves[moves.length-1].length == 4){
        let caparray = moves.pop();
        let capturedpiece = caparray.shift();
        let attackingpiece = caparray.shift();
        let capturedbox = caparray.shift();
        let attackingplace = caparray.shift();
        attackingpiece.innerText = attackingplace.innerText;
        capturedbox.innerText = capturedpiece.innerText;
        attackingplace.innerText = "";
        capturedpiece.innerText = "";
        insertimages();
        coloring();
        if(attackingpiece.textContent.includes("pawn")){
            passant=1; pawnid=capturedbox.id;
        }
        else if(attackingpiece.innerText==("Wking")){
            Wkingmove -=1
        }
        else if(attackingpiece.innerText==("Bking")){
            Bkingmove -=1
        }
        if(turn == "B"){
            turn = "W";
            turntxt.innerText = "White's Turn";
            turntxt.style.color = "White";
            blackMins.innerText=bStartTime[0] 
            blackSecs.innerText=bStartTime[1]
        }
        else{
            turn = "B";
            turntxt.innerText = "Black's Turn";
            turntxt.style.color = "black";
            whiteMins.innerText=wStartTime[0] 
            whiteSecs.innerText=wStartTime[1]
        }
    }
    checkmate();
    if(win==1 ||turntxt.style.fontWeight=="900"){
        win = 0;
        timer = setInterval(pTimer,1000);
        turntxt.style.fontWeight="unset";
        turntxt.style.webkitTextStroke="unset";
    }
    } 
});

// reset btn function 

resetbtn.addEventListener("click", function(){
    window.location.reload();
})

// check mate function 

function checkmate(kingmoveboxrow, kingmoveboxcolumn){
    checkvalue = 0;
    numberofchecks = 0;
    if(kingmoveboxrow !==undefined && kingmoveboxcolumn!==undefined){
        kingmovebox = document.getElementById(kingmoveboxrow+"_"+kingmoveboxcolumn);
        kingmoveboxinnertext= kingmovebox.innerText;
    }
    for(let box of boxes){
        if(kingmoveboxrow !==undefined && kingmoveboxcolumn!==undefined){
            box = kingmovebox;
            box.innerText=turn+"king";
        }
        let boxid = Array.from(box.id);
        let kingrow = eval(boxid.shift());
        let kingcolumn = eval(boxid.pop());
        // check mate for Black king
        if(box.textContent.includes("Bking")){
            // wrook and queen check mate
            if(kingrow>1){
                  for(let i=1 ; i<kingrow ; i++){
                        if(document.getElementById(kingrow-i+"_"+kingcolumn).innerText!=="" && 
                        document.getElementById(kingrow-i+"_"+kingcolumn).innerText!=="Wqueen" &&
                        document.getElementById(kingrow-i+"_"+kingcolumn).innerText!=="Wrook"){
                            break;
                        }
                        else if(document.getElementById(kingrow-i+"_"+kingcolumn).innerText=="Wqueen" ||
                                document.getElementById(kingrow-i+"_"+kingcolumn).innerText=="Wrook"){
                                    box.style.backgroundColor="red";
                                    checkmatedirection = "down";
                                    numberofchecks++;
                                    break;
                        }
                    }
                    if(box.style.backgroundColor=="red" && checkmatedirection == "down"){
                        availablemove=[];
                        for(let i=1 ; i<kingrow ; i++){
                            if(document.getElementById(kingrow-i+"_"+kingcolumn).innerText=="" || 
                            document.getElementById(kingrow-i+"_"+kingcolumn).textContent.includes("W")){
                                availablemove.push(document.getElementById(kingrow-i+"_"+kingcolumn));
                                if(document.getElementById(kingrow-i+"_"+kingcolumn).textContent.includes("W")){
                                    break;
                                }
                            }
                        }
                    }
            }
            if(kingrow<8){
                    for(let i=1 ; i<=8-kingrow ; i++){
                        if(document.getElementById(kingrow+i+"_"+kingcolumn).innerText!=="" && 
                        document.getElementById(kingrow+i+"_"+kingcolumn).innerText!=="Wqueen" &&
                        document.getElementById(kingrow+i+"_"+kingcolumn).innerText!=="Wrook"){
                            break;
                        }
                        else if(document.getElementById(kingrow+i+"_"+kingcolumn).innerText=="Wqueen" ||
                                document.getElementById(kingrow+i+"_"+kingcolumn).innerText=="Wrook"){
                                    box.style.backgroundColor="red";
                                    checkmatedirection = "up";
                                    numberofchecks++;
                                    break;
                        }
                    }
                    if(box.style.backgroundColor=="red" && checkmatedirection == "up"){
                        availablemove=[];
                        for(let i=1 ; i<=8-kingrow ; i++){
                            if(document.getElementById(kingrow+i+"_"+kingcolumn).innerText=="" || 
                            document.getElementById(kingrow+i+"_"+kingcolumn).textContent.includes("W")){
                                availablemove.push(document.getElementById(kingrow+i+"_"+kingcolumn));
                                if(document.getElementById(kingrow+i+"_"+kingcolumn).textContent.includes("W")){
                                    break;
                                }
                            }
                        }
                    }
            }
            if(kingcolumn>1){
                for(let i=1 ; i<kingcolumn ; i++){
                      if(document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText!=="" && 
                      document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText!=="Wqueen" &&
                      document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText!=="Wrook"){
                          break;
                      }
                      else if(document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText=="Wqueen" ||
                              document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText=="Wrook"){
                                  box.style.backgroundColor="red";
                                  checkmatedirection = "left";
                                  numberofchecks++;
                                  break;
                      }
                }
                if(box.style.backgroundColor=="red" && checkmatedirection == "left"){
                    availablemove=[];
                    for(let i=1 ; i<kingcolumn ; i++){
                        if(document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText=="" || 
                        document.getElementById(kingrow+"_"+(kingcolumn-i)).textContent.includes("W")){
                            availablemove.push(document.getElementById(kingrow+"_"+(kingcolumn-i)));
                            if(document.getElementById(kingrow+"_"+(kingcolumn-i)).textContent.includes("W")){
                                break;
                            }
                        }
                    }
                }
            }
            if(kingcolumn<8){
                for(let i=1 ; i<=8-kingcolumn ; i++){
                      if(document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText!=="" && 
                      document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText!=="Wqueen" &&
                      document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText!=="Wrook"){
                          break;
                      }
                      else if(document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText=="Wqueen" ||
                              document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText=="Wrook"){
                                  box.style.backgroundColor="red";
                                  checkmatedirection = "right";
                                    numberofchecks++;
                                    break;
                      }
                }
                if(box.style.backgroundColor=="red" && checkmatedirection == "right"){
                    availablemove=[];
                    for(let i=1 ; i<=8-kingcolumn ; i++){
                        if(document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText=="" || 
                        document.getElementById(kingrow+"_"+(kingcolumn+i)).textContent.includes("W")){
                            availablemove.push(document.getElementById(kingrow+"_"+(kingcolumn+i)));
                            if(document.getElementById(kingrow+"_"+(kingcolumn+i)).textContent.includes("W")){
                                break;
                            }
                        }
                    }
                }
            }
            // bishop and queen check mate
            for(let i=1 ; i<=8 ; i++){
                if(document.getElementById(kingrow+i+"_"+(kingcolumn+i)) === null ||
                    document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText!=="" && 
                document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText!=="Wqueen" &&
                document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText!=="Wbishop"){
                    break;
                }
                else if(document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText=="Wqueen" ||
                        document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText=="Wbishop"){
                            box.style.backgroundColor="red";
                            checkmatedirection = "upright";
                                    numberofchecks++;
                                    break;
                }
            }
            if(box.style.backgroundColor=="red" && checkmatedirection == "upright"){
                availablemove=[];
                for(let i=1 ; i<=8 ; i++){
                    if(document.getElementById(kingrow+i+"_"+(kingcolumn+i))!==null){
                        if(document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText=="" || 
                        document.getElementById(kingrow+i+"_"+(kingcolumn+i)).textContent.includes("W")){
                            availablemove.push(document.getElementById(kingrow+i+"_"+(kingcolumn+i)));
                            if(document.getElementById(kingrow+i+"_"+(kingcolumn+i)).textContent.includes("W")){
                                break;
                            }
                        }
                    }  
                }
            }
            for(let i=1 ; i<=8 ; i++){     
                if(document.getElementById(kingrow-i+"_"+(kingcolumn-i)) === null ||
                    document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText!=="" && 
                document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText!=="Wqueen" &&
                document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText!=="Wbishop"){
                    break;
                }
                else if(document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText=="Wqueen" ||
                        document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText=="Wbishop"){
                            box.style.backgroundColor="red";
                            checkmatedirection = "downleft";
                                    numberofchecks++;
                                    break;
                }
            }
            if(box.style.backgroundColor=="red" && checkmatedirection == "downleft"){
                availablemove=[];
                for(let i=1 ; i<=8 ; i++){
                    if(document.getElementById(kingrow-i+"_"+(kingcolumn-i))!==null){
                        if(document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText=="" || 
                        document.getElementById(kingrow-i+"_"+(kingcolumn-i)).textContent.includes("W")){
                            availablemove.push(document.getElementById(kingrow-i+"_"+(kingcolumn-i)));
                            if(document.getElementById(kingrow-i+"_"+(kingcolumn-i)).textContent.includes("W")){
                                break;
                            }
                        }
                    }
                }
            }
            for(let i=1 ; i<=8 ; i++){    
                if(document.getElementById(kingrow+i+"_"+(kingcolumn-i)) === null ||
                    document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText!=="" && 
                document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText!=="Wqueen" &&
                document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText!=="Wbishop"){
                    break;
                }
                else if(document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText=="Wqueen" ||
                        document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText=="Wbishop"){
                            box.style.backgroundColor="red";
                            checkmatedirection = "upleft";
                                    numberofchecks++;
                                    break;
                }
            }
            if(box.style.backgroundColor=="red" && checkmatedirection == "upleft"){
                availablemove=[];
                for(let i=1 ; i<=8 ; i++){
                    if(document.getElementById(kingrow+i+"_"+(kingcolumn-i))!==null){
                        if(document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText=="" || 
                        document.getElementById(kingrow+i+"_"+(kingcolumn-i)).textContent.includes("W")){
                            availablemove.push(document.getElementById(kingrow+i+"_"+(kingcolumn-i)));
                            if(document.getElementById(kingrow+i+"_"+(kingcolumn-i)).textContent.includes("W")){
                                break;
                            }
                        }
                    }
                }
            }
            for(let i=1 ; i<=8 ; i++){
                if(document.getElementById(kingrow-i+"_"+(kingcolumn+i)) === null ||
                    document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText!=="" && 
                document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText!=="Wqueen" &&
                document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText!=="Wbishop"){
                    break;
                }
                else if(document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText=="Wqueen" ||
                        document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText=="Wbishop"){
                            box.style.backgroundColor="red";
                            checkmatedirection = "downright";
                                    numberofchecks++;
                                    break;
                }
            };
            if(box.style.backgroundColor=="red" && checkmatedirection == "downright"){
                availablemove=[];
                for(let i=1 ; i<=8 ; i++){
                    if(document.getElementById(kingrow-i+"_"+(kingcolumn+i))!==null){
                        if(document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText=="" || 
                        document.getElementById(kingrow-i+"_"+(kingcolumn+i)).textContent.includes("W")){
                            availablemove.push(document.getElementById(kingrow-i+"_"+(kingcolumn+i)));
                            if(document.getElementById(kingrow-i+"_"+(kingcolumn+i)).textContent.includes("W")){
                                break;
                            }
                        }
                    }
                }
            };
            // knight check mate
            if(document.getElementById(kingrow+1+"_"+(kingcolumn+2)) !== null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn+2)).innerText=="Wknight"){
                    box.style.backgroundColor="red";
                    checkmatedirection = "L";
                    numberofchecks++;
                    availablemove=[document.getElementById(kingrow+1+"_"+(kingcolumn+2))];
                };
            };
            if(document.getElementById(kingrow+2+"_"+(kingcolumn+1)) !== null){
                if(document.getElementById(kingrow+2+"_"+(kingcolumn+1)).innerText=="Wknight"){
                    box.style.backgroundColor="red";
                    checkmatedirection = "L";
                    numberofchecks++;
                    availablemove=[document.getElementById(kingrow+2+"_"+(kingcolumn+1))];
                };
            };
            if(document.getElementById(kingrow-1+"_"+(kingcolumn+2)) !== null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn+2)).innerText=="Wknight"){
                    box.style.backgroundColor="red";
                    checkmatedirection = "L";
                    numberofchecks++;
                    availablemove=[document.getElementById(kingrow-1+"_"+(kingcolumn+2))];
                };
            }; 
            if(document.getElementById(kingrow-2+"_"+(kingcolumn+1)) !== null){
                if(document.getElementById(kingrow-2+"_"+(kingcolumn+1)).innerText=="Wknight"){
                    box.style.backgroundColor="red";
                    checkmatedirection = "L";
                    numberofchecks++;
                    availablemove=[document.getElementById(kingrow-2+"_"+(kingcolumn+1))];
                };
            };  
            if(document.getElementById(kingrow+2+"_"+(kingcolumn-1)) !== null){
                if(document.getElementById(kingrow+2+"_"+(kingcolumn-1)).innerText=="Wknight"){
                    box.style.backgroundColor="red";
                    checkmatedirection = "L";
                    numberofchecks++;
                    availablemove=[document.getElementById(kingrow+2+"_"+(kingcolumn-1))];
                };
            };
            if(document.getElementById(kingrow+1+"_"+(kingcolumn-2)) !== null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn-2)).innerText=="Wknight"){
                    box.style.backgroundColor="red";
                    checkmatedirection = "L";
                    numberofchecks++;
                    availablemove=[document.getElementById(kingrow+1+"_"+(kingcolumn-2))];
                };
            }; 
            if(document.getElementById(kingrow-1+"_"+(kingcolumn-2)) !== null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn-2)).innerText=="Wknight"){
                    box.style.backgroundColor="red";
                    checkmatedirection = "L";
                    numberofchecks++;
                    availablemove=[document.getElementById(kingrow-1+"_"+(kingcolumn-2))];
                };
            }; 
            if(document.getElementById(kingrow-2+"_"+(kingcolumn-1)) !== null){
                if(document.getElementById(kingrow-2+"_"+(kingcolumn-1)).innerText=="Wknight"){
                    box.style.backgroundColor="red";
                    checkmatedirection = "L";
                    numberofchecks++;
                    availablemove=[document.getElementById(kingrow-2+"_"+(kingcolumn-1))];
                };
            };
            // pawn check mate
            if(document.getElementById(kingrow-1+"_"+(kingcolumn-1)) !==null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn-1)).innerText=="Wpawn"){
                    box.style.backgroundColor="red";
                    checkmatedirection = "pawndownleft";
                    numberofchecks++;
                    availablemove=[document.getElementById(kingrow-1+"_"+(kingcolumn-1))];
                }
            };
            if(document.getElementById(kingrow-1+"_"+(kingcolumn+1)) !==null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn+1)).innerText=="Wpawn"){
                    box.style.backgroundColor="red";
                    checkmatedirection = "pawndownright";
                    numberofchecks++;
                    availablemove=[document.getElementById(kingrow-1+"_"+(kingcolumn+1))];
                }
            };
            // king check mate 
            if(document.getElementById(kingrow+1+"_"+(kingcolumn+1)) !==null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn+1)).innerText=="Wking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingupright";
                }
            }
            if(document.getElementById(kingrow-1+"_"+(kingcolumn-1)) !==null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn-1)).innerText=="Wking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingdownleft";
                }
            }
            if(document.getElementById(kingrow+1+"_"+(kingcolumn-1)) !==null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn-1)).innerText=="Wking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingupleft";
                }
            }
            if(document.getElementById(kingrow-1+"_"+(kingcolumn+1)) !==null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn+1)).innerText=="Wking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingdownright";
                }
            }
            if(document.getElementById(kingrow+1+"_"+(kingcolumn)) !==null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn)).innerText=="Wking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingup";
                }
            }
            if(document.getElementById(kingrow-1+"_"+(kingcolumn)) !==null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn)).innerText=="Wking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingdown";
                }
            }
            if(document.getElementById(kingrow+"_"+(kingcolumn+1)) !==null){
                if(document.getElementById(kingrow+"_"+(kingcolumn+1)).innerText=="Wking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingright";
                }
            }
            if(document.getElementById(kingrow+"_"+(kingcolumn-1)) !==null){
                if(document.getElementById(kingrow+"_"+(kingcolumn-1)).innerText=="Wking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingleft";
                }
            };
        };
        // check mate for White king
        if(box.textContent.includes("Wking")){
            // wrook and queen check mate
            if(kingrow>1){
                for(let i=1 ; i<kingrow ; i++){
                      if(document.getElementById(kingrow-i+"_"+kingcolumn).innerText!=="" && 
                      document.getElementById(kingrow-i+"_"+kingcolumn).innerText!=="Bqueen" &&
                      document.getElementById(kingrow-i+"_"+kingcolumn).innerText!=="Brook"){
                          break;
                      }
                      else if(document.getElementById(kingrow-i+"_"+kingcolumn).innerText=="Bqueen" ||
                              document.getElementById(kingrow-i+"_"+kingcolumn).innerText=="Brook"){
                                  box.style.backgroundColor="red";
                                  checkmatedirection = "down";
                                    numberofchecks++;
                                    break;
                        }
                }
                if(box.style.backgroundColor=="red" && checkmatedirection == "down"){
                    availablemove=[];
                    for(let i=1 ; i<kingrow ; i++){
                        if(document.getElementById(kingrow-i+"_"+kingcolumn).innerText=="" || 
                        document.getElementById(kingrow-i+"_"+kingcolumn).textContent.includes("B")){
                            availablemove.push(document.getElementById(kingrow-i+"_"+kingcolumn));
                            if(document.getElementById(kingrow-i+"_"+kingcolumn).textContent.includes("B")){
                                break;
                            }
                        }
                    }
                }
            }
            if(kingrow<8){
                    for(let i=1 ; i<=8-kingrow ; i++){
                        if(document.getElementById(kingrow+i+"_"+kingcolumn).innerText!=="" && 
                        document.getElementById(kingrow+i+"_"+kingcolumn).innerText!=="Bqueen" &&
                        document.getElementById(kingrow+i+"_"+kingcolumn).innerText!=="Brook"){
                            break;
                        }
                        else if(document.getElementById(kingrow+i+"_"+kingcolumn).innerText=="Bqueen" ||
                                document.getElementById(kingrow+i+"_"+kingcolumn).innerText=="Brook"){
                                    box.style.backgroundColor="red";
                                    checkmatedirection = "up";
                                    numberofchecks++;
                                    break;
                        }
                    }
                    if(box.style.backgroundColor=="red" && checkmatedirection == "up"){
                        availablemove=[];
                        for(let i=1 ; i<=8-kingrow ; i++){
                            if(document.getElementById(kingrow+i+"_"+kingcolumn).innerText=="" || 
                            document.getElementById(kingrow+i+"_"+kingcolumn).textContent.includes("B")){
                                availablemove.push(document.getElementById(kingrow+i+"_"+kingcolumn));
                                if(document.getElementById(kingrow+i+"_"+kingcolumn).textContent.includes("B")){
                                    break;
                                }
                            }
                        }
                    }
            }
            if(kingcolumn>1){
                for(let i=1 ; i<kingcolumn ; i++){
                        if(document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText!=="" && 
                        document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText!=="Bqueen" &&
                        document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText!=="Brook"){
                            break;
                        }
                        else if(document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText=="Bqueen" ||
                                document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText=="Brook"){
                                    box.style.backgroundColor="red";
                                    checkmatedirection = "left";
                                    numberofchecks++;
                                    break;
                        }
                }
                if(box.style.backgroundColor=="red" && checkmatedirection == "left"){
                    availablemove=[];
                    for(let i=1 ; i<kingcolumn ; i++){
                        if(document.getElementById(kingrow+"_"+(kingcolumn-i)).innerText=="" || 
                        document.getElementById(kingrow+"_"+(kingcolumn-i)).textContent.includes("B")){
                            availablemove.push(document.getElementById(kingrow+"_"+(kingcolumn-i)));
                            if(document.getElementById(kingrow+"_"+(kingcolumn-i)).textContent.includes("B")){
                                break;
                            }
                        }
                    }
                }
            }
            if(kingcolumn<8){
                for(let i=1 ; i<=8-kingcolumn ; i++){
                        if(document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText!=="" && 
                        document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText!=="Bqueen" &&
                        document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText!=="Brook"){
                            break;
                        }
                        else if(document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText=="Bqueen" ||
                                document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText=="Brook"){
                                    box.style.backgroundColor="red";
                                    checkmatedirection = "right";
                                    numberofchecks++;
                                    break;
                        }
                }
                if(box.style.backgroundColor=="red" && checkmatedirection == "right"){
                    availablemove=[];
                    for(let i=1 ; i<=8-kingcolumn ; i++){
                        if(document.getElementById(kingrow+"_"+(kingcolumn+i)).innerText=="" || 
                        document.getElementById(kingrow+"_"+(kingcolumn+i)).textContent.includes("B")){
                            availablemove.push(document.getElementById(kingrow+"_"+(kingcolumn+i)));
                            if(document.getElementById(kingrow+"_"+(kingcolumn+i)).textContent.includes("B")){
                                break;
                            }
                        }
                    }
                }
            }
            // bishop and queen check mate
            for(let i=1 ; i<=8 ; i++){
                if(document.getElementById(kingrow+i+"_"+(kingcolumn+i)) === null ||
                    document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText!=="" && 
                document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText!=="Bqueen" &&
                document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText!=="Bbishop"){
                    break;
                }
                else if(document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText=="Bqueen" ||
                        document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText=="Bbishop"){
                            box.style.backgroundColor="red";
                            checkmatedirection = "upright";
                                    numberofchecks++;
                                    break;
                }
            }
            if(box.style.backgroundColor=="red" && checkmatedirection == "upright"){
                availablemove=[];
                for(let i=1 ; i<=8 ; i++){
                    if(document.getElementById(kingrow+i+"_"+(kingcolumn+i))!==null){
                        if(document.getElementById(kingrow+i+"_"+(kingcolumn+i)).innerText=="" || 
                        document.getElementById(kingrow+i+"_"+(kingcolumn+i)).textContent.includes("B")){
                            availablemove.push(document.getElementById(kingrow+i+"_"+(kingcolumn+i)));
                            if(document.getElementById(kingrow+i+"_"+(kingcolumn+i)).textContent.includes("B")){
                                break;
                            }
                        }       
                    }
                }
            }
            for(let i=1 ; i<=8 ; i++){     
                if(document.getElementById(kingrow-i+"_"+(kingcolumn-i)) === null ||
                    document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText!=="" && 
                document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText!=="Bqueen" &&
                document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText!=="Bbishop"){
                    break;
                }
                else if(document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText=="Bqueen" ||
                        document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText=="Bbishop"){
                            box.style.backgroundColor="red";
                            checkmatedirection = "downleft";
                                    numberofchecks++;
                                    break;
                }
            }
            if(box.style.backgroundColor=="red" && checkmatedirection == "downleft"){
                availablemove=[];
                for(let i=1 ; i<=8 ; i++){
                    if(document.getElementById(kingrow-i+"_"+(kingcolumn-i))!==null){
                        if(document.getElementById(kingrow-i+"_"+(kingcolumn-i)).innerText=="" || 
                        document.getElementById(kingrow-i+"_"+(kingcolumn-i)).textContent.includes("B")){
                        availablemove.push(document.getElementById(kingrow-i+"_"+(kingcolumn-i)));
                            if(document.getElementById(kingrow-i+"_"+(kingcolumn-i)).textContent.includes("B")){
                                break;
                            }
                        }
                    }
                }
            }
            for(let i=1 ; i<=8 ; i++){    
                if(document.getElementById(kingrow+i+"_"+(kingcolumn-i)) === null ||
                    document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText!=="" && 
                document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText!=="Bqueen" &&
                document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText!=="Bbishop"){
                    break;
                }
                else if(document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText=="Bqueen" ||
                        document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText=="Bbishop"){
                            box.style.backgroundColor="red";
                            checkmatedirection = "upleft";
                                    numberofchecks++;
                                    break;
                }
            }
            if(box.style.backgroundColor=="red" && checkmatedirection == "upleft"){
                availablemove=[];
                for(let i=1 ; i<=8 ; i++){
                    if(document.getElementById(kingrow+i+"_"+(kingcolumn-i))!==null){
                        if(document.getElementById(kingrow+i+"_"+(kingcolumn-i)).innerText=="" || 
                        document.getElementById(kingrow+i+"_"+(kingcolumn-i)).textContent.includes("B")){
                        availablemove.push(document.getElementById(kingrow+i+"_"+(kingcolumn-i)));
                            if(document.getElementById(kingrow+i+"_"+(kingcolumn-i)).textContent.includes("B")){
                                break;
                            }
                        }
                    }
                }
            }
            for(let i=1 ; i<=8 ; i++){
                if(document.getElementById(kingrow-i+"_"+(kingcolumn+i)) === null ||
                    document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText!=="" && 
                document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText!=="Bqueen" &&
                document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText!=="Bbishop"){
                    break;
                }
                else if(document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText=="Bqueen" ||
                        document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText=="Bbishop"){
                            box.style.backgroundColor="red";
                            checkmatedirection = "downright";
                                    numberofchecks++;
                                    break;
                }
            };
            if(box.style.backgroundColor=="red" && checkmatedirection == "downright"){
                availablemove=[];
                for(let i=1 ; i<=8 ; i++){
                    if(document.getElementById(kingrow-i+"_"+(kingcolumn+i))!==null){
                        if(document.getElementById(kingrow-i+"_"+(kingcolumn+i)).innerText=="" || 
                        document.getElementById(kingrow-i+"_"+(kingcolumn+i)).textContent.includes("B")){
                        availablemove.push(document.getElementById(kingrow-i+"_"+(kingcolumn+i)));
                            if(document.getElementById(kingrow-i+"_"+(kingcolumn+i)).textContent.includes("B")){
                                break;
                            }
                        }
                    }
                }
            };
            // knight check mate
            if(document.getElementById(kingrow+1+"_"+(kingcolumn+2)) !== null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn+2)).innerText=="Bknight"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="L";
                    availablemove=[document.getElementById(kingrow+1+"_"+(kingcolumn+2))];
                };
            };
            if(document.getElementById(kingrow+2+"_"+(kingcolumn+1)) !== null){
                if(document.getElementById(kingrow+2+"_"+(kingcolumn+1)).innerText=="Bknight"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="L";
                    availablemove=[document.getElementById(kingrow+2+"_"+(kingcolumn+1))];
                };
            };
            if(document.getElementById(kingrow-1+"_"+(kingcolumn+2)) !== null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn+2)).innerText=="Bknight"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="L";
                    availablemove=[document.getElementById(kingrow-1+"_"+(kingcolumn+2))];
                };
            }; 
            if(document.getElementById(kingrow-2+"_"+(kingcolumn+1)) !== null){
                if(document.getElementById(kingrow-2+"_"+(kingcolumn+1)).innerText=="Bknight"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="L";
                    availablemove=[document.getElementById(kingrow-2+"_"+(kingcolumn+1))];
                };
            };  
            if(document.getElementById(kingrow+2+"_"+(kingcolumn-1)) !== null){
                if(document.getElementById(kingrow+2+"_"+(kingcolumn-1)).innerText=="Bknight"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="L";
                    availablemove=[document.getElementById(kingrow+2+"_"+(kingcolumn-1))];
                };
            };
            if(document.getElementById(kingrow+1+"_"+(kingcolumn-2)) !== null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn-2)).innerText=="Bknight"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="L";
                    availablemove=[document.getElementById(kingrow+1+"_"+(kingcolumn-2))];
                };
            }; 
            if(document.getElementById(kingrow-1+"_"+(kingcolumn-2)) !== null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn-2)).innerText=="Bknight"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="L";
                    availablemove=[document.getElementById(kingrow-1+"_"+(kingcolumn-2))];
                };
            }; 
            if(document.getElementById(kingrow-2+"_"+(kingcolumn-1)) !== null){
                if(document.getElementById(kingrow-2+"_"+(kingcolumn-1)).innerText=="Bknight"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="L";
                    availablemove=[document.getElementById(kingrow-2+"_"+(kingcolumn-1))];
                };
            };
            // pawn check mate
            if(document.getElementById(kingrow+1+"_"+(kingcolumn-1)) !==null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn-1)).innerText=="Bpawn"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="pawnupleft";
                    availablemove=[document.getElementById(kingrow+1+"_"+(kingcolumn-1))];
                }
            };
            if(document.getElementById(kingrow+1+"_"+(kingcolumn+1)) !==null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn+1)).innerText=="Bpawn"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="pawnupright";
                    availablemove=[document.getElementById(kingrow+1+"_"+(kingcolumn+1))];
                }
            };
            // king check mate 
            if(document.getElementById(kingrow+1+"_"+(kingcolumn+1)) !==null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn+1)).innerText=="Bking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingupright";
                }
            }
            if(document.getElementById(kingrow-1+"_"+(kingcolumn-1)) !==null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn-1)).innerText=="Bking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingdownleft";
                }
            }
            if(document.getElementById(kingrow+1+"_"+(kingcolumn-1)) !==null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn-1)).innerText=="Bking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingupleft";
                }
            }
            if(document.getElementById(kingrow-1+"_"+(kingcolumn+1)) !==null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn+1)).innerText=="Bking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingdownright";
                }
            }
            if(document.getElementById(kingrow+1+"_"+(kingcolumn)) !==null){
                if(document.getElementById(kingrow+1+"_"+(kingcolumn)).innerText=="Bking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingup";
                }
            }
            if(document.getElementById(kingrow-1+"_"+(kingcolumn)) !==null){
                if(document.getElementById(kingrow-1+"_"+(kingcolumn)).innerText=="Bking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingdown";
                }
            }
            if(document.getElementById(kingrow+"_"+(kingcolumn+1)) !==null){
                if(document.getElementById(kingrow+"_"+(kingcolumn+1)).innerText=="Bking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingright";
                }
            }
            if(document.getElementById(kingrow+"_"+(kingcolumn-1)) !==null){
                if(document.getElementById(kingrow+"_"+(kingcolumn-1)).innerText=="Bking"){
                    box.style.backgroundColor="red";
                    numberofchecks++;
                    checkmatedirection ="kingleft";
                }
            };
        }
        if(box.textContent.includes(turn+"king") && box.style.backgroundColor =="red" || box.style.backgroundColor =="darkred"){
            checkvalue= true;
        }
    }
    if(numberofchecks >1 || checkvalue!== true){
        availablemove = [];
    }
    if(kingmoveboxrow !==undefined && kingmoveboxcolumn!==undefined){
        kingmovebox.innerText=kingmoveboxinnertext;
        insertimages();
        if(kingmovebox.style.backgroundColor=="red"){
            if((kingmoveboxrow + kingmoveboxcolumn) % 2 !== 0){
                kingmovebox.style.backgroundColor = "burlywood";
            }else{kingmovebox.style.backgroundColor = "#9d6e3f";}
        }
    }
    return checkvalue;
};

//function to check piece available moves

function availablemoves(piecerow,piececolumn){
    value ="*";
    let piece = document.getElementById(piecerow+"_"+piececolumn);
    // | up  
    for(let i = 1; i<=8;i++){
        if(document.getElementById(piecerow-i+"_"+piececolumn)!==null){
            if(document.getElementById(piecerow-i+"_"+piececolumn).innerText!=="" && document.getElementById(piecerow-i+"_"+piececolumn).innerText!==turn+"king"){
                break;  
            }
            else if(document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"king"){
                if(piece.innerText==turn+"knight"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+piececolumn)===null ||
                        document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"rook" ||
                        document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"queen"){
                            value = "*";
                            break; 
                        }
                        else if(document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("rook") ||
                        document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"bishop"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+piececolumn)===null ||
                        document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"rook" ||
                        document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("rook") ||
                        document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"rook"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+piececolumn)===null ||
                        document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"rook" ||
                        document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("rook") ||
                        document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("queen")){
                            value = "up";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"queen"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+piececolumn)===null ||
                        document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"rook" ||
                        document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("rook") ||
                        document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("queen")){
                            value = "up";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"pawn"){
                    if(turn == "W"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow+i+"_"+piececolumn)===null ||
                            document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes(turn) ||
                            document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"rook" ||
                            document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("rook") ||
                            document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("queen")){
                                value = "up";
                                break;
                            }
                        }
                    }
                    if(turn == "B"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow+i+"_"+piececolumn)===null ||
                            document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes(turn) ||
                            document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"rook" ||
                            document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("rook") ||
                            document.getElementById(piecerow+i+"_"+piececolumn).textContent.includes("queen")){
                                value = "nomoves";
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    // | down
    for(let i = 1; i<=8;i++){
        if(document.getElementById(piecerow+i+"_"+piececolumn)!==null){
            if(document.getElementById(piecerow+i+"_"+piececolumn).innerText!=="" && document.getElementById(piecerow+i+"_"+piececolumn).innerText!==turn+"king"){
                break;
            }
            else if(document.getElementById(piecerow+i+"_"+piececolumn).innerText==turn+"king"){
                if(piece.innerText==turn+"knight"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+piececolumn)===null ||
                        document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"rook" ||
                        document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("rook") ||
                        document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"bishop"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+piececolumn)===null ||
                        document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"rook" ||
                        document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("rook") ||
                        document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"rook"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+piececolumn)===null ||
                        document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"rook" ||
                        document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("rook") ||
                        document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("queen")){
                            value = "up";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"queen"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+piececolumn)===null ||
                        document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"rook" ||
                        document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("rook") ||
                        document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("queen")){
                            value = "up";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"pawn"){
                    if(turn == "W"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow-i+"_"+piececolumn)===null ||
                            document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes(turn) ||
                            document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"rook" ||
                            document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("rook") ||
                            document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("queen")){
                                value = "nomoves";
                                break;
                            }
                        }
                    }
                    if(turn == "B"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow-i+"_"+piececolumn)===null ||
                            document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes(turn) ||
                            document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"rook" ||
                            document.getElementById(piecerow-i+"_"+piececolumn).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("rook") ||
                            document.getElementById(piecerow-i+"_"+piececolumn).textContent.includes("queen")){
                                value = "down";
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    // _ left
    for(let i = 1; i<=8;i++){
        if(document.getElementById(piecerow+"_"+(piececolumn+i))!==null){
            if(document.getElementById(piecerow+"_"+(piececolumn+i)).innerText!=="" && document.getElementById(piecerow+"_"+(piececolumn+i)).innerText!==turn+"king"){
                break;  
            }
            else if(document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"king"){
                if(piece.innerText==turn+"knight"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"rook" ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("rook") ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"bishop"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"rook" ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("rook") ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"rook"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"rook" ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("rook") ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "right";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"queen"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"rook" ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("rook") ||
                        document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "right";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"pawn"){
                    if(turn == "W"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow+"_"+(piececolumn-i))===null ||
                            document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes(turn) ||
                            document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"rook" ||
                            document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("rook") ||
                            document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("queen")){
                                value = "nomoves";
                                break;
                            }
                        }
                    }
                    if(turn == "B"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow+"_"+(piececolumn-i))===null ||
                            document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes(turn) ||
                            document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"rook" ||
                            document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("rook") ||
                            document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes("queen")){
                                value = "nomoves";
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    // _ right
    for(let i = 1; i<=8;i++){
        if(document.getElementById(piecerow+"_"+(piececolumn-i))!==null){
            if(document.getElementById(piecerow+"_"+(piececolumn-i)).innerText!=="" && document.getElementById(piecerow+"_"+(piececolumn-i)).innerText!==turn+"king"){
                break;  
            }
            else if(document.getElementById(piecerow+"_"+(piececolumn-i)).innerText==turn+"king"){
                if(piece.innerText==turn+"knight"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"rook" ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("rook") ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"bishop"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"rook" ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("rook") ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"rook"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"rook" ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("rook") ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "right";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"queen"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"rook" ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("rook") ||
                        document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "right";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"pawn"){
                    if(turn == "W"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow+"_"+(piececolumn+i))===null ||
                            document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes(turn) ||
                            document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"rook" ||
                            document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("rook") ||
                            document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("queen")){
                                value = "nomoves";
                                break;
                            }
                        }
                    }
                    if(turn == "B"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow+"_"+(piececolumn+i))===null ||
                            document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes(turn) ||
                            document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"rook" ||
                            document.getElementById(piecerow+"_"+(piececolumn+i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("rook") ||
                            document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes("queen")){
                                value = "nomoves";
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    //  "/" up right
    for(let i = 1; i<=8;i++){
        if(document.getElementById(piecerow-i+"_"+(piececolumn-i))!==null){
            if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText!=="" && document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText!==turn+"king"){
                break;  
            }
            else if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"king"){
                if(piece.innerText==turn+"knight"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"bishop"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "upright";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"rook"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"queen"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "upright";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"pawn"){
                    if(turn == "W"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow+i+"_"+(piececolumn+i))===null ||
                            document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                            document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                            document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                            document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("queen")){
                                value = "upright";
                                break;
                            }
                        }
                    }
                    if(turn == "B"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow+i+"_"+(piececolumn+i))===null ||
                            document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                            document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                            document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                            document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes("queen")){
                                value = "downleft";
                                break;
                            }
                        }
                    }
                }
            }
        }
    }    
    //  "\\" up left
    for(let i = 1; i<=8;i++){
        if(document.getElementById(piecerow-i+"_"+(piececolumn+i))!==null){
            if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText!=="" && document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText!==turn+"king"){
                break;  
            }
            else if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"king"){
                if(piece.innerText==turn+"knight"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"bishop"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "upleft";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"rook"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"queen"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow+i+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "upleft";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"pawn"){
                    if(turn == "W"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow+i+"_"+(piececolumn-i))===null ||
                            document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                            document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                            document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                            document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("queen")){
                                value = "upleft";
                                break;
                            }
                        }
                    }
                    if(turn == "B"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow+i+"_"+(piececolumn-i))===null ||
                            document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                            document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                            document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                            document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes("queen")){
                                value = "downright";
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    // "\\" down right
    for(let i = 1; i<=8;i++){
        if(document.getElementById(piecerow+i+"_"+(piececolumn-i))!==null){
            if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText!=="" && document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText!==turn+"king"){
                break;  
            }
            else if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText==turn+"king"){
                if(piece.innerText==turn+"knight"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"bishop"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "upleft";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"rook"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"queen"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+(piececolumn+i))===null ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("queen")){
                            value = "upleft";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"pawn"){
                    if(turn == "W"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow-i+"_"+(piececolumn+i))===null ||
                            document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                            document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                            document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                            document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("queen")){
                                value = "upleft";
                                break;
                            }
                        }
                    }
                    if(turn == "B"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow-i+"_"+(piececolumn+i))===null ||
                            document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes(turn) ||
                            document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"bishop" ||
                            document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("bishop") ||
                            document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes("queen")){
                                value = "downright";
                                break;
                            }
                        }
                    }
                }
            }
        }   
    }
    // "/" down left
    for(let i = 1; i<=8;i++){
        if(document.getElementById(piecerow+i+"_"+(piececolumn+i))!==null){
            if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText!=="" && document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText!==turn+"king"){
                break;  
            }
            else if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText==turn+"king"){
                if(piece.innerText==turn+"knight"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"bishop"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "upright";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"rook"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "nomoves";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"queen"){
                    for(let i = 1; i<=8;i++){
                        if(document.getElementById(piecerow-i+"_"+(piececolumn-i))===null ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                            value = "*";
                            break;
                        }
                        else if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                        document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("queen")){
                            value = "upright";
                            break;
                        }
                    } 
                }
                if(piece.innerText==turn+"pawn"){
                    if(turn == "W"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow-i+"_"+(piececolumn-i))===null ||
                            document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                            document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                            document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                            document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("queen")){
                                value = "upright";
                                break;
                            }
                        }
                    }
                    if(turn == "B"){
                        for(let i = 1; i<=8;i++){
                            if(document.getElementById(piecerow-i+"_"+(piececolumn-i))===null ||
                            document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes(turn) ||
                            document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"bishop" ||
                            document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText==turn+"queen"){
                                value = "*";
                                break;
                            }
                            else if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("bishop") ||
                            document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes("queen")){
                                value = "downleft";
                                break;
                            }
                        }
                    }
                }
            }
        }   
    };// king
    kingavailablemoves =[];
    if(document.getElementById(piecerow+"_"+piececolumn)!==null){
        if(document.getElementById(piecerow+"_"+piececolumn).innerText==turn+"king"){
            if(document.getElementById(piecerow+1+"_"+(piececolumn+1))!==null){
                if(checkmate(piecerow+1,piececolumn+1)!==true){
                    if(checkmate()!==true ||checkvalue==true && checkmatedirection!=="upright"&& checkmatedirection!=="downleft"){
                        kingavailablemoves.push(document.getElementById(piecerow+1+"_"+(piececolumn+1)));
                    }
                    if(checkvalue==true && document.getElementById(piecerow+1+"_"+(piececolumn+1)).innerText!==""){
                        kingavailablemoves.push(document.getElementById(piecerow+1+"_"+(piececolumn+1)));
                    } 
                }
            }
        };
    };
    if(document.getElementById(piecerow+"_"+piececolumn)!==null){
        if(document.getElementById(piecerow+"_"+piececolumn).innerText==turn+"king"){
            if(document.getElementById(piecerow-1+"_"+(piececolumn-1))!==null){
                if(checkmate(piecerow-1,piececolumn-1)!==true){
                    if(checkmate()!==true ||checkvalue==true && checkmatedirection!=="upright"&& checkmatedirection!=="downleft"){
                        kingavailablemoves.push(document.getElementById(piecerow-1+"_"+(piececolumn-1)));
                    }
                    if(checkvalue==true && document.getElementById(piecerow-1+"_"+(piececolumn-1)).innerText!==""){
                        kingavailablemoves.push(document.getElementById(piecerow-1+"_"+(piececolumn-1)));
                    }
                }
            }
        };
    };
    if(document.getElementById(piecerow+"_"+piececolumn)!==null){
        if(document.getElementById(piecerow+"_"+piececolumn).innerText==turn+"king"){
            if(document.getElementById(piecerow+1+"_"+(piececolumn-1))!==null){
                if(checkmate(piecerow+1,piececolumn-1)!==true){
                    if(checkmate()!==true ||checkvalue==true && checkmatedirection!=="upleft"&& checkmatedirection!=="downright"){
                        kingavailablemoves.push(document.getElementById(piecerow+1+"_"+(piececolumn-1)));
                    }
                    if(checkvalue==true && document.getElementById(piecerow+1+"_"+(piececolumn-1)).innerText!==""){
                        kingavailablemoves.push(document.getElementById(piecerow+1+"_"+(piececolumn-1)));
                    }
                }
            }
        };
    };
    if(document.getElementById(piecerow+"_"+piececolumn)!==null){
        if(document.getElementById(piecerow+"_"+piececolumn).innerText==turn+"king"){
            if(document.getElementById(piecerow-1+"_"+(piececolumn+1))!==null){
                if(checkmate(piecerow-1,piececolumn+1)!==true){
                    if(checkmate()!==true ||checkvalue==true && checkmatedirection!=="upleft"&& checkmatedirection!=="downright"){
                        kingavailablemoves.push(document.getElementById(piecerow-1+"_"+(piececolumn+1)));
                    }
                    if(checkvalue==true && document.getElementById(piecerow-1+"_"+(piececolumn+1)).innerText!==""){
                        kingavailablemoves.push(document.getElementById(piecerow-1+"_"+(piececolumn+1)));
                    }
                }
            }
        };
    };
    if(document.getElementById(piecerow+"_"+piececolumn)!==null){
        if(document.getElementById(piecerow+"_"+piececolumn).innerText==turn+"king"){
            if(document.getElementById(piecerow+1+"_"+(piececolumn))!==null){
                if(checkmate(piecerow+1,piececolumn)!==true){
                    if(checkmate()!==true ||checkvalue==true && checkmatedirection!=="up"&& checkmatedirection!=="down"){
                        kingavailablemoves.push(document.getElementById(piecerow+1+"_"+(piececolumn)));
                    }
                    if(checkvalue==true && document.getElementById(piecerow+1+"_"+(piececolumn)).innerText!==""){
                        kingavailablemoves.push(document.getElementById(piecerow+1+"_"+(piececolumn)));
                    }
                }
            }
        };
    };
    if(document.getElementById(piecerow+"_"+piececolumn)!==null){
        if(document.getElementById(piecerow+"_"+piececolumn).innerText==turn+"king"){
            if(document.getElementById(piecerow+"_"+(piececolumn+1))!==null){
                if(checkmate(piecerow,piececolumn+1)!==true){
                    if(checkmate()!==true ||checkvalue==true && checkmatedirection!=="right"&& checkmatedirection!=="left"){
                        kingavailablemoves.push(document.getElementById(piecerow+"_"+(piececolumn+1)));
                    }
                    if(checkvalue==true && document.getElementById(piecerow+"_"+(piececolumn+1)).innerText!==""){
                        kingavailablemoves.push(document.getElementById(piecerow+"_"+(piececolumn+1)));
                    }
                }
            }
        };
    };
    if(document.getElementById(piecerow+"_"+piececolumn)!==null){
        if(document.getElementById(piecerow+"_"+piececolumn).innerText==turn+"king"){
            if(document.getElementById(piecerow-1+"_"+(piececolumn))!==null){
                if(checkmate(piecerow-1,piececolumn)!==true){
                    if(checkmate()!==true ||checkvalue==true && checkmatedirection!=="down"&& checkmatedirection!=="up"){
                        kingavailablemoves.push(document.getElementById(piecerow-1+"_"+(piececolumn)));
                    }
                    if(checkvalue==true && document.getElementById(piecerow-1+"_"+(piececolumn)).innerText!==""){
                        kingavailablemoves.push(document.getElementById(piecerow-1+"_"+(piececolumn)));
                    }
                }
            }
        };
    };
    if(document.getElementById(piecerow+"_"+piececolumn)!==null){
        if(document.getElementById(piecerow+"_"+piececolumn).innerText==turn+"king"){
            if(document.getElementById(piecerow+"_"+(piececolumn-1))!==null){
                if(checkmate(piecerow,piececolumn-1)!==true){
                    if(checkmate()!==true ||checkvalue==true && checkmatedirection!=="left"&& checkmatedirection!=="right"){
                        kingavailablemoves.push(document.getElementById(piecerow+"_"+(piececolumn-1)));
                    }
                    if(checkvalue==true && document.getElementById(piecerow+"_"+(piececolumn-1)).innerText!==""){
                        kingavailablemoves.push(document.getElementById(piecerow+"_"+(piececolumn-1)));
                    }
                }
            }
        };
    };
    if(value == undefined){
        value = "*";
    }
    return value;
}

// function to show available moves 

function showmoves(piecerow, piececolumn){
    let piece = document.getElementById(piecerow+"_"+piececolumn);
    if(piece.innerText==turn+"king"){
        kingavailablemoves.forEach(element => {
            if(element.textContent.includes(turn)){   // king
                return;
            }
            else{element.style.backgroundColor="lightseagreen";}
        }); // castling
        if(turn == "W" && Wkingmove == 0 && Wrightrookmove ==0 && document.getElementById("1_6").innerText==""&&
        document.getElementById("1_7").innerText==""&& checkvalue!==true&&checkmate(1,6)!==true&&checkmate(1,7)!==true&&document.getElementById("1_8").innerText=="Wrook"){
            document.getElementById("1_7").style.backgroundColor="lightseagreen";
        }
        if(turn == "W" && Wkingmove == 0 && Wleftrookmove ==0 && document.getElementById("1_2").innerText==""&&
        document.getElementById("1_3").innerText==""&& document.getElementById("1_4").innerText==""&&checkvalue!==true&&
        checkmate(1,2)!==true&&checkmate(1,3)!==true&&checkmate(1,4)!==true&&document.getElementById("1_1").innerText=="Wrook"){
            document.getElementById("1_3").style.backgroundColor="lightseagreen";
        }
        if(turn == "B" && Bkingmove == 0 && Brightrookmove ==0 && document.getElementById("8_6").innerText==""&&
        document.getElementById("8_7").innerText==""&& checkvalue!==true&&checkmate(8,6)!==true&&checkmate(8,7)!==true&&document.getElementById("8_8").innerText=="Brook"){
            document.getElementById("8_7").style.backgroundColor="lightseagreen";
        }
        if(turn == "B" && Bkingmove == 0 && Bleftrookmove ==0 && document.getElementById("8_2").innerText==""&&
        document.getElementById("8_3").innerText==""&& document.getElementById("8_4").innerText==""&&checkvalue!==true&&
        checkmate(8,2)!==true&&checkmate(8,3)!==true&&checkmate(8,4)!==true&&document.getElementById("8_1").innerText=="Brook"){
            document.getElementById("8_3").style.backgroundColor="lightseagreen";
        }
    }// white pawn
    if(piece.innerText=="Wpawn"){
        if(checkvalue==true && value == "*"){
            if(document.getElementById(piecerow+1+"_"+piececolumn)!==null){
                if(availablemove.includes(document.getElementById(piecerow+1+"_"+piececolumn))&&document.getElementById(piecerow+1+"_"+piececolumn).innerText==""){
                    document.getElementById(piecerow+1+"_"+piececolumn).style.backgroundColor="lightseagreen";
                }
            }//capture
            if(document.getElementById(piecerow+1+"_"+(piececolumn-1))!==null){
                if(document.getElementById(piecerow+1+"_"+(piececolumn-1)).textContent.includes("B")&&availablemove.includes(document.getElementById(piecerow+1+"_"+(piececolumn-1)))){
                    document.getElementById(piecerow+1+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";
                }
            }
            if(document.getElementById(piecerow+1+"_"+(piececolumn+1))!==null){
                if(document.getElementById(piecerow+1+"_"+(piececolumn+1)).textContent.includes("B")&&availablemove.includes(document.getElementById(piecerow+1+"_"+(piececolumn+1)))){
                    document.getElementById(piecerow+1+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";
                }
            }//first move
            if(document.getElementById(piecerow+2+"_"+piececolumn)!==null){
                if(piecerow==2&&availablemove.includes(document.getElementById(piecerow+2+"_"+piececolumn))&&document.getElementById(piecerow+2+"_"+piececolumn).innerText==""
                &&document.getElementById(piecerow+1+"_"+piececolumn).innerText==""){
                    document.getElementById(piecerow+2+"_"+piececolumn).style.backgroundColor="lightseagreen";
                }
            }
        }
        if(checkvalue!==true && value == "*"){
            if(document.getElementById(piecerow+1+"_"+piececolumn).innerText==""){
                document.getElementById(piecerow+1+"_"+piececolumn).style.backgroundColor="lightseagreen"; //move
            }
            if(document.getElementById(piecerow+1+"_"+(piececolumn-1))!==null){ //capture
                if(document.getElementById(piecerow+1+"_"+(piececolumn-1)).textContent.includes("B")){
                    document.getElementById(piecerow+1+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";
                }
            }
            if(document.getElementById(piecerow+1+"_"+(piececolumn+1))!==null){
                if(document.getElementById(piecerow+1+"_"+(piececolumn+1)).textContent.includes("B")){
                    document.getElementById(piecerow+1+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";
                }
            }//first move
            if(piecerow==2 &&document.getElementById(piecerow+2+"_"+piececolumn).innerText==""&&document.getElementById(piecerow+1+"_"+piececolumn).innerText==""){
                document.getElementById(piecerow+2+"_"+piececolumn).style.backgroundColor="lightseagreen";
            }           
        }
        if(checkvalue!==true && value == "up"){
            if(document.getElementById(piecerow+1+"_"+piececolumn).innerText==""){
                document.getElementById(piecerow+1+"_"+piececolumn).style.backgroundColor="lightseagreen";
            }
            if(document.getElementById(piecerow+2+"_"+piececolumn)!==null){
                if(piecerow==2&&document.getElementById(piecerow+2+"_"+piececolumn).innerText==""){
                document.getElementById(piecerow+2+"_"+piececolumn).style.backgroundColor="lightseagreen";
                }
            }
        }
        if(checkvalue!==true && value == "upright"){
            if(document.getElementById(piecerow+1+"_"+(piececolumn+1)).textContent.includes("B")){
                document.getElementById(piecerow+1+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";
            }
        }
        if(checkvalue!==true && value == "upleft"){
            if(document.getElementById(piecerow+1+"_"+(piececolumn-1)).textContent.includes("B")){
                document.getElementById(piecerow+1+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";
            }
        }// en passant rule
        if(checkvalue==true&&piecerow==5&&piececolumn>1&&passant==1&&pawnid==piecerow+"_"+(piececolumn-1)&&availablemove.includes(document.getElementById(piecerow+1+"_"+(piececolumn-1)))){
            document.getElementById(piecerow+1+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";
        }
        if(checkvalue==true&&piecerow==5&&piececolumn<8&&passant==1&&pawnid==piecerow+"_"+(piececolumn+1)&&availablemove.includes(document.getElementById(piecerow+1+"_"+(piececolumn+1)))){
            document.getElementById(piecerow+1+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";
        }
        if(checkvalue!==true&&piecerow==5&&piececolumn>1&&passant==1&&pawnid==piecerow+"_"+(piececolumn-1)){
            document.getElementById(piecerow+1+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";
        }
        if(checkvalue!==true&&piecerow==5&&piececolumn<8&&passant==1&&pawnid==piecerow+"_"+(piececolumn+1)){
            document.getElementById(piecerow+1+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";
        }
    }// black pawn
    if(piece.innerText=="Bpawn"){
        if(checkvalue==true && value == "*"){
            if(document.getElementById(piecerow-1+"_"+piececolumn)!==null){
                if(availablemove.includes(document.getElementById(piecerow-1+"_"+piececolumn))&&document.getElementById(piecerow-1+"_"+piececolumn).innerText==""){
                    document.getElementById(piecerow-1+"_"+piececolumn).style.backgroundColor="lightseagreen";
                }
            }//capture
            if(document.getElementById(piecerow-1+"_"+(piececolumn-1))!==null){
                if(document.getElementById(piecerow-1+"_"+(piececolumn-1)).textContent.includes("W")&&availablemove.includes(document.getElementById(piecerow-1+"_"+(piececolumn-1)))){
                    document.getElementById(piecerow-1+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";
                }
            }
            if(document.getElementById(piecerow-1+"_"+(piececolumn+1))!==null){
                if(document.getElementById(piecerow-1+"_"+(piececolumn+1)).textContent.includes("W")&&availablemove.includes(document.getElementById(piecerow-1+"_"+(piececolumn+1)))){
                    document.getElementById(piecerow-1+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";
                }
            }//first move
            if(document.getElementById(piecerow-2+"_"+piececolumn)!==null){
                if(piecerow==7&&availablemove.includes(document.getElementById(piecerow-2+"_"+piececolumn))&&document.getElementById(piecerow-2+"_"+piececolumn).innerText==""
                &&document.getElementById(piecerow-1+"_"+piececolumn).innerText==""){
                    document.getElementById(piecerow-2+"_"+piececolumn).style.backgroundColor="lightseagreen";
                }
            }
        }
        if(checkvalue!==true && value == "*"){
            if(document.getElementById(piecerow-1+"_"+piececolumn).innerText==""){
                document.getElementById(piecerow-1+"_"+piececolumn).style.backgroundColor="lightseagreen"; //move
            }
            if(document.getElementById(piecerow-1+"_"+(piececolumn-1))!==null){ //capture
                if(document.getElementById(piecerow-1+"_"+(piececolumn-1)).textContent.includes("W")){
                    document.getElementById(piecerow-1+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";
                }
            }
            if(document.getElementById(piecerow-1+"_"+(piececolumn+1))!==null){
                if(document.getElementById(piecerow-1+"_"+(piececolumn+1)).textContent.includes("W")){
                    document.getElementById(piecerow-1+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";
                }
            }//first move
            if(piecerow==7 &&document.getElementById(piecerow-2+"_"+piececolumn).innerText==""&&document.getElementById(piecerow-1+"_"+piececolumn).innerText==""){
                document.getElementById(piecerow-2+"_"+piececolumn).style.backgroundColor="lightseagreen";
            }           
        }
        if(checkvalue!==true && value == "down"){
            if(document.getElementById(piecerow-1+"_"+piececolumn).innerText==""){
                document.getElementById(piecerow-1+"_"+piececolumn).style.backgroundColor="lightseagreen";
            }
            if(document.getElementById(piecerow-2+"_"+piececolumn)!==null){
                if(piecerow==2&&document.getElementById(piecerow-2+"_"+piececolumn).innerText==""){
                document.getElementById(piecerow-2+"_"+piececolumn).style.backgroundColor="lightseagreen";
                }
            }
        }
        if(checkvalue!==true && value == "downright"){
            if(document.getElementById(piecerow-1+"_"+(piececolumn+1)).textContent.includes("W")){
                document.getElementById(piecerow-1+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";
            }
        }
        if(checkvalue!==true && value == "downleft"){
            if(document.getElementById(piecerow-1+"_"+(piececolumn-1)).textContent.includes("W")){
                document.getElementById(piecerow-1+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";
            }
        }// en passant rule
        if(checkvalue==true&&piecerow==4&&piececolumn>1&&passant==1&&pawnid==piecerow+"_"+(piececolumn-1)&&availablemove.includes(document.getElementById(piecerow-1+"_"+(piececolumn-1)))){
            document.getElementById(piecerow-1+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";
        }
        if(checkvalue==true&&piecerow==4&&piececolumn<8&&passant==1&&pawnid==piecerow+"_"+(piececolumn+1)&&availablemove.includes(document.getElementById(piecerow-1+"_"+(piececolumn+1)))){
            document.getElementById(piecerow-1+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";
        }
        if(checkvalue!==true&&piecerow==4&&piececolumn>1&&passant==1&&pawnid==piecerow+"_"+(piececolumn-1)){
            document.getElementById(piecerow-1+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";
        }
        if(checkvalue!==true&&piecerow==4&&piececolumn<8&&passant==1&&pawnid==piecerow+"_"+(piececolumn+1)){
            document.getElementById(piecerow-1+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";
        }
    }// bishop queen moves
    if(piece.innerText==turn+"bishop" || piece.innerText==turn+"queen"){
        if(checkvalue!==true&&value=="*"){
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+i+"_"+(piececolumn+i))==null){break;}
                else if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow+i+"_"+(piececolumn+i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow-i+"_"+(piececolumn+i))==null){break;}
                else if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow-i+"_"+(piececolumn+i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+i+"_"+(piececolumn-i))==null){break;}
                else if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow+i+"_"+(piececolumn-i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow-i+"_"+(piececolumn-i))==null){break;}
                else if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow-i+"_"+(piececolumn-i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText!==""){break;}}
            }
        }
        if(checkvalue!==true&&value=="upright"){
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+i+"_"+(piececolumn+i))==null){break;}
                else if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow+i+"_"+(piececolumn+i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow-i+"_"+(piececolumn-i))==null){break;}
                else if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow-i+"_"+(piececolumn-i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText!==""){break;}}
            }
        }
        if(checkvalue!==true&&value=="upleft"){
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow-i+"_"+(piececolumn+i))==null){break;}
                else if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow-i+"_"+(piececolumn+i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+i+"_"+(piececolumn-i))==null){break;}
                else if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow+i+"_"+(piececolumn-i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText!==""){break;}}
            }
        }
        if(checkvalue==true&&value=="*"){
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+i+"_"+(piececolumn+i))==null){break;}
                else if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).textContent.includes(turn)||
                document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText!=''&&!availablemove.includes(document.getElementById(piecerow+i+"_"+(piececolumn+i)))){break;}
                else if(availablemove.includes(document.getElementById(piecerow+i+"_"+(piececolumn+i))))
                {document.getElementById(piecerow+i+"_"+(piececolumn+i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+i+"_"+(piececolumn+i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow-i+"_"+(piececolumn+i))==null){break;}
                else if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).textContent.includes(turn)||
                document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText!=''&&!availablemove.includes(document.getElementById(piecerow-i+"_"+(piececolumn+i)))){break;}
                else if(availablemove.includes(document.getElementById(piecerow-i+"_"+(piececolumn+i))))
                {document.getElementById(piecerow-i+"_"+(piececolumn+i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow-i+"_"+(piececolumn+i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+i+"_"+(piececolumn-i))==null){break;}
                else if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).textContent.includes(turn)||
                document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText!=''&&!availablemove.includes(document.getElementById(piecerow+i+"_"+(piececolumn-i)))){break;}
                else if(availablemove.includes(document.getElementById(piecerow+i+"_"+(piececolumn-i)))){
                    document.getElementById(piecerow+i+"_"+(piececolumn-i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+i+"_"+(piececolumn-i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow-i+"_"+(piececolumn-i))==null){break;}
                else if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).textContent.includes(turn)||
                document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText!=''&&!availablemove.includes(document.getElementById(piecerow-i+"_"+(piececolumn-i)))){break;}
                else if(availablemove.includes(document.getElementById(piecerow-i+"_"+(piececolumn-i)))){
                    document.getElementById(piecerow-i+"_"+(piececolumn-i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow-i+"_"+(piececolumn-i)).innerText!==""){break;}}
            }
        }
    }// rook queen moves
    if(piece.innerText==turn+"rook" || piece.innerText==turn+"queen"){
        if(checkvalue!==true&&value=="*"){
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+i+"_"+(piececolumn))==null){break;}
                else if(document.getElementById(piecerow+i+"_"+(piececolumn)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow+i+"_"+(piececolumn)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+i+"_"+(piececolumn)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow-i+"_"+(piececolumn))==null){break;}
                else if(document.getElementById(piecerow-i+"_"+(piececolumn)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow-i+"_"+(piececolumn)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow-i+"_"+(piececolumn)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+"_"+(piececolumn-i))==null){break;}
                else if(document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow+"_"+(piececolumn-i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+"_"+(piececolumn-i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+"_"+(piececolumn+i))==null){break;}
                else if(document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow+"_"+(piececolumn+i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+"_"+(piececolumn+i)).innerText!==""){break;}}
            }
        }
        if(checkvalue!==true&&value=="up"){
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+i+"_"+(piececolumn))==null){break;}
                else if(document.getElementById(piecerow+i+"_"+(piececolumn)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow+i+"_"+(piececolumn)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+i+"_"+(piececolumn)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow-i+"_"+(piececolumn))==null){break;}
                else if(document.getElementById(piecerow-i+"_"+(piececolumn)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow-i+"_"+(piececolumn)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow-i+"_"+(piececolumn)).innerText!==""){break;}}
            }
        }
        if(checkvalue!==true&&value=="right"){
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+"_"+(piececolumn+i))==null){break;}
                else if(document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow+"_"+(piececolumn+i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+"_"+(piececolumn+i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+"_"+(piececolumn-i))==null){break;}
                else if(document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes(turn)){break;}
                else{document.getElementById(piecerow+"_"+(piececolumn-i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+"_"+(piececolumn-i)).innerText!==""){break;}}
            }
        }
        if(checkvalue==true&&value=="*"){
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+i+"_"+(piececolumn))==null){break;}
                else if(document.getElementById(piecerow+i+"_"+(piececolumn)).textContent.includes(turn)||
                document.getElementById(piecerow+i+"_"+(piececolumn)).innerText!=''&&!availablemove.includes(document.getElementById(piecerow+i+"_"+(piececolumn)))){break;}
                else if(availablemove.includes(document.getElementById(piecerow+i+"_"+(piececolumn))))
                {document.getElementById(piecerow+i+"_"+(piececolumn)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+i+"_"+(piececolumn)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow-i+"_"+(piececolumn))==null){break;}
                else if(document.getElementById(piecerow-i+"_"+(piececolumn)).textContent.includes(turn)||
                document.getElementById(piecerow-i+"_"+(piececolumn)).innerText!=''&&!availablemove.includes(document.getElementById(piecerow-i+"_"+(piececolumn)))){break;}
                else if(availablemove.includes(document.getElementById(piecerow-i+"_"+(piececolumn))))
                {document.getElementById(piecerow-i+"_"+(piececolumn)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow-i+"_"+(piececolumn)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+"_"+(piececolumn+i))==null){break;}
                else if(document.getElementById(piecerow+"_"+(piececolumn+i)).textContent.includes(turn)||
                document.getElementById(piecerow+"_"+(piececolumn+i)).innerText!=''&&!availablemove.includes(document.getElementById(piecerow+"_"+(piececolumn+i)))){break;}
                else if(availablemove.includes(document.getElementById(piecerow+"_"+(piececolumn+i)))){
                    document.getElementById(piecerow+"_"+(piececolumn+i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+"_"+(piececolumn+i)).innerText!==""){break;}}
            }
            for(let i = 1; i<=8;i++){
                if(document.getElementById(piecerow+"_"+(piececolumn-i))==null){break;}
                else if(document.getElementById(piecerow+"_"+(piececolumn-i)).textContent.includes(turn)||
                document.getElementById(piecerow+"_"+(piececolumn-i)).innerText!=''&&!availablemove.includes(document.getElementById(piecerow+"_"+(piececolumn-i)))){break;}
                else if(availablemove.includes(document.getElementById(piecerow+"_"+(piececolumn-i)))){
                    document.getElementById(piecerow+"_"+(piececolumn-i)).style.backgroundColor="lightseagreen";
                     if(document.getElementById(piecerow+"_"+(piececolumn-i)).innerText!==""){break;}}
            }
        }
    } // knight moves
    if(piece.innerText==turn+"knight"){
        if(checkvalue!==true&&value=="*"){
            if(document.getElementById(piecerow+1+"_"+(piececolumn+2))!==null){
                if(document.getElementById(piecerow+1+"_"+(piececolumn+2)).textContent.includes(turn)){}
                else{document.getElementById(piecerow+1+"_"+(piececolumn+2)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow+2+"_"+(piececolumn+1))!==null){
                if(document.getElementById(piecerow+2+"_"+(piececolumn+1)).textContent.includes(turn)){}
                else{document.getElementById(piecerow+2+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow-1+"_"+(piececolumn+2))!==null){
                if(document.getElementById(piecerow-1+"_"+(piececolumn+2)).textContent.includes(turn)){}
                else{document.getElementById(piecerow-1+"_"+(piececolumn+2)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow+1+"_"+(piececolumn-2))!==null){
                if(document.getElementById(piecerow+1+"_"+(piececolumn-2)).textContent.includes(turn)){}
                else{document.getElementById(piecerow+1+"_"+(piececolumn-2)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow+2+"_"+(piececolumn-1))!==null){
                if(document.getElementById(piecerow+2+"_"+(piececolumn-1)).textContent.includes(turn)){}
                else{document.getElementById(piecerow+2+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow-2+"_"+(piececolumn+1))!==null){
                if(document.getElementById(piecerow-2+"_"+(piececolumn+1)).textContent.includes(turn)){}
                else{document.getElementById(piecerow-2+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow-2+"_"+(piececolumn-1))!==null){
                if(document.getElementById(piecerow-2+"_"+(piececolumn-1)).textContent.includes(turn)){}
                else{document.getElementById(piecerow-2+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow-1+"_"+(piececolumn-2))!==null){
                if(document.getElementById(piecerow-1+"_"+(piececolumn-2)).textContent.includes(turn)){}
                else{document.getElementById(piecerow-1+"_"+(piececolumn-2)).style.backgroundColor="lightseagreen";}
            }
        }
        if(checkvalue==true&&value=="*"){
            if(document.getElementById(piecerow+1+"_"+(piececolumn+2))!==null){
                if(document.getElementById(piecerow+1+"_"+(piececolumn+2)).textContent.includes(turn)){}
                else if(availablemove.includes(document.getElementById(piecerow+1+"_"+(piececolumn+2)))){
                    document.getElementById(piecerow+1+"_"+(piececolumn+2)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow+2+"_"+(piececolumn+1))!==null){
                if(document.getElementById(piecerow+2+"_"+(piececolumn+1)).textContent.includes(turn)){}
                else if(availablemove.includes(document.getElementById(piecerow+2+"_"+(piececolumn+1)))){
                    document.getElementById(piecerow+2+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow-1+"_"+(piececolumn+2))!==null){
                if(document.getElementById(piecerow-1+"_"+(piececolumn+2)).textContent.includes(turn)){}
                else if(availablemove.includes(document.getElementById(piecerow-1+"_"+(piececolumn+2)))){
                    document.getElementById(piecerow-1+"_"+(piececolumn+2)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow+1+"_"+(piececolumn-2))!==null){
                if(document.getElementById(piecerow+1+"_"+(piececolumn-2)).textContent.includes(turn)){}
                else if(availablemove.includes(document.getElementById(piecerow+1+"_"+(piececolumn-2)))){
                    document.getElementById(piecerow+1+"_"+(piececolumn-2)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow+2+"_"+(piececolumn-1))!==null){
                if(document.getElementById(piecerow+2+"_"+(piececolumn-1)).textContent.includes(turn)){}
                else if(availablemove.includes(document.getElementById(piecerow+2+"_"+(piececolumn-1)))){
                    document.getElementById(piecerow+2+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow-2+"_"+(piececolumn+1))!==null){
                if(document.getElementById(piecerow-2+"_"+(piececolumn+1)).textContent.includes(turn)){}
                else if(availablemove.includes(document.getElementById(piecerow-2+"_"+(piececolumn+1)))){
                    document.getElementById(piecerow-2+"_"+(piececolumn+1)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow-2+"_"+(piececolumn-1))!==null){
                if(document.getElementById(piecerow-2+"_"+(piececolumn-1)).textContent.includes(turn)){}
                else if(availablemove.includes(document.getElementById(piecerow-2+"_"+(piececolumn-1)))){
                    document.getElementById(piecerow-2+"_"+(piececolumn-1)).style.backgroundColor="lightseagreen";}
            }
            if(document.getElementById(piecerow-1+"_"+(piececolumn-2))!==null){
                if(document.getElementById(piecerow-1+"_"+(piececolumn-2)).textContent.includes(turn)){}
                else if(availablemove.includes(document.getElementById(piecerow-1+"_"+(piececolumn-2)))){
                    document.getElementById(piecerow-1+"_"+(piececolumn-2)).style.backgroundColor="lightseagreen";}
            }
        }
    }
};
 
// pawn promotion function

function promotion(box){
    promo = true;
    if(box.id.includes("8_")){
        for(let div of divs){
            if(div.textContent.includes("B")){
                let divtxt = div.innerText;
                let newtxt = divtxt.replace("B", "W")
                div.innerText = newtxt;
            }
            div.addEventListener("click", function(){
                if(div.textContent.includes("W")){
                    if(box.innerText.includes("pawn")){
                        box.innerText= div.innerText;
                    }
                    promotiondiv.classList.add("displaynone");
                    insertimages();
                    checkmate();
                    turn = "B";
                    turntxt.innerText = "Black's Turn";
                    turntxt.style.color = "black";
                    wStartTime=[whiteMins.innerText,whiteSecs.innerText]
                }
            })
        }
    }
    if(box.id.includes("1_")){
        for(let div of divs){
            if(div.textContent.includes("W")){
                let divtxt = div.innerText;
                let newtxt = divtxt.replace("W", "B")
                div.innerText = newtxt;
            }
            div.addEventListener("click", function(){
                if(div.textContent.includes("B")){
                    if(box.innerText.includes("pawn")){
                        box.innerText= div.innerText;
                    }
                    promotiondiv.classList.add("displaynone");
                    insertimages();
                    checkmate();
                    turn = "W";
                    turntxt.innerText = "White's Turn";
                    turntxt.style.color = "white";
                    bStartTime=[blackMins.innerText,blackSecs.innerText]
                }
            })
        }
    }
    promo =false;
    insertimages();
    promotiondiv.classList.remove("displaynone");
};

// drag and drop function

for(let box of boxes){
    if(box.textContent.includes("B")){
        box.firstChild.classList.add("nodrag");
    }
};

let drop; let dragged;
function dragDrop(){
    for(let box of boxes){

        box.addEventListener("dragend", function(){
            if(drop!==undefined){
                if(drop.style.backgroundColor!=="cadetblue"&&drop.style.backgroundColor!=="darkred"){
                    coloring();
                }
                else{dragged = true;}
            }
            else{coloring()}
        })

        box.addEventListener("dragover", function(e){
            e.preventDefault();
        })

        box.addEventListener("drop", function(e){
            e.stopPropagation();
            e.preventDefault();
            if(e.target!==null && e.target.parentNode!==null){
            if(e.target.style.backgroundColor=="lightseagreen" || e.target.parentNode.style.backgroundColor=="lightseagreen"){
                if(e.target.parentNode.childElementCount==1){
                    capture(e.target.parentNode);
                }
                else{
                move(e.target);
                }
                if(turn == "B"){
                    for(let box of boxes){
                        if(box.textContent.includes("W")){
                            box.firstChild.classList.add("nodrag");
                        }
                        if(box.textContent.includes("B")){
                            box.firstChild.classList.remove("nodrag");
                        }
                    }
                }
                else{
                    for(let box of boxes){
                        if(box.textContent.includes("B")){
                            box.firstChild.classList.add("nodrag");
                        }
                        if(box.textContent.includes("W")){
                            box.firstChild.classList.remove("nodrag");
                        }
                    }
                }
            }
            drop = e.target.parentNode;
            }
        })
    };
};
dragDrop();

// time function

let wsecs; let bsecs;
function pTimer(){
    if(turn === "W" && moves.length>=2){
        if(whiteSecs.innerText=="00"){
            if(whiteMins.innerText<=10){
                whiteMins.innerText = ("0"+(whiteMins.innerText-1))
            }
            else{whiteMins.innerText = whiteMins.innerText-1}
            whiteSecs.innerText = 59
            wsecs =10;
        }
        else{
            if(whiteSecs.innerText>10){
                whiteSecs.innerText--
            }
            else{
                wsecs--
                whiteSecs.innerText = ("0"+(wsecs))
            }
        }
    }
    if(turn === "B" && moves.length>=2){
        if(blackSecs.innerText=="00"){
            if(blackMins.innerText<=10){
                blackMins.innerText = ("0"+(blackMins.innerText-1))
            }
            else{blackMins.innerText = blackMins.innerText-1}
            blackSecs.innerText = 59
            bsecs =10;
        }
        else{
            if(blackSecs.innerText>10){
                blackSecs.innerText--
            }
            else{
                bsecs--
                blackSecs.innerText = ("0"+(bsecs))
            }
        }
    }
    if(whiteSecs.innerText=="00" && whiteMins.innerText=="01"){
        lowtimesound.play()
    }
    if(whiteMins.innerText=="00"){
        document.getElementById("whitetime").style.color="red"
    }
    if(whiteMins.innerText=="00"&&whiteSecs.innerText=="00"){
        clearInterval(timer);
        turntxt.innerText = "Black won"
        turntxt.style.color = "black"
        victorySound.play()
        moves =[]
        boxes.forEach(box =>{
            box.addEventListener("mousedown", coloring)
            if(box.innerText!==""){
                box.firstChild.classList.add("nodrag")
            }
        })
    }
    if(blackSecs.innerText=="00" && blackMins.innerText=="01"){
        lowtimesound.play()
    }
    if(blackMins.innerText=="00"){
        document.getElementById("blacktime").style.color="red"
    }
    if(blackMins.innerText=="00"&&blackSecs.innerText=="00"){
        clearInterval(timer);
        turntxt.innerText = "White won"
        turntxt.style.color = "white"
        victorySound.play()
        moves =[]
        boxes.forEach(box =>{
            box.addEventListener("mousedown", coloring)
            if(box.innerText!==""){
                box.firstChild.classList.add("nodrag")
            }
        })
    }
}
let timer = setInterval(pTimer,1000)

// function to choose time 

function choosetime(min){
    
    if(min == "Unlimited"){
        clearInterval(timer);
        timeBoxes.forEach(box =>{box.style.display="none"})
        choosetimebox.style.display="none"
    }
    else{whiteMins.innerText=min
         blackMins.innerText=min
         choosetimebox.style.display="none"
    }
    rightsidesection.classList.remove("displaynone")
}

// function to check winner 

let win = 0;
function checkWinner(){
        let tempCMV = checkvalue;
        let tempAM= availablemove;
        for(let box of boxes){
            if(box.innerText.includes(turn)){
                let boxid = Array.from(box.id);
                let boxrow = eval(boxid.shift());
                let boxcolumn = eval(boxid.pop());
                availablemove = tempAM;
                checkvalue = tempCMV;
                availablemoves(boxrow,boxcolumn);
                showmoves(boxrow,boxcolumn);
                if(Array.from(boxes).some((box) => box.style.backgroundColor=="lightseagreen")){
                    win = 0;
                    coloring();
                    break;
                }
                else{win = 1;}
            }
        }
        if(win==1 && checkmate()==true){
            if(turn=="B"){
                turntxt.innerText = "White won";
                turntxt.style.color= "white";
            }
            if(turn=="W"){
                turntxt.innerText = "Black won";
                turntxt.style.color= "black";
            }
            victorySound.play();
            clearInterval(timer);
        }
        if(win==1 && checkvalue!=true){
            turntxt.innerText= "stalemate"
            turntxt.style.color= "red";
            turntxt.style.fontWeight= "700";
            turntxt.style.webkitTextStroke= "1px black";
            victorySound.play();
            clearInterval(timer);
        }
}

// function to check draw 

function checkDraw(){
    if(!Array.from(boxes).some(box=>box.innerText!=''&&!box.innerText.includes("king"))){
        turntxt.innerText = "Draw game!";
        turntxt.style.color= "darkgreen";
        turntxt.style.fontWeight= "900";
        turntxt.style.webkitTextStroke= "1px black";
        win = 1;
        victorySound.play();
        clearInterval(timer);
    }
};
