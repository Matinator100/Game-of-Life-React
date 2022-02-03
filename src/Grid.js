import {useEffect, useState} from 'react';

const Grid = () => {

const numRows = 100;
const numCols = 100;

const [grid, setGrid] = useState([]);
const [aliveTiles, setAliveTiles] = useState([]);
const [isRunning, setIsRunning] = useState(false);

useEffect(() =>{
    let gridArr = [];
    for (let x = 0; x < numCols; x++){
      for(let y = 0; y < numRows; y++){
        gridArr.push([y, x,false]);
      }
    }
    setGrid(gridArr.map((x) => x)); 
}, [])


const toggleGame = () =>{
  setIsRunning(!isRunning);
}

useEffect(() => {
  if(isRunning){
    const interval = setInterval(() => {

      let tempAliveTiles =  aliveTiles.filter((tile) => checkAlive(tile));
      let aliveZombieTiles = checkZombies();
      tempAliveTiles = tempAliveTiles.concat(aliveZombieTiles);
      let indexes = {}
      tempAliveTiles = tempAliveTiles.filter((c) => {
        if(typeof indexes[c] == 'undefined'){
          indexes[c] = c[1];
          return true;
        }
        return false;
    });
      console.log("======== Temp Alive =========")
      console.log(tempAliveTiles);
      console.log("======== Temp Alive =========")
      setAliveTiles(tempAliveTiles);
      setGrid(grid => [...grid]);
    }, 100)
    return () => clearInterval(interval)
  }
  else{
    console.log("Game Stopped");
  }
}, [isRunning, aliveTiles]);


const checkAlive = (tile) =>{
  let count = 0;
  let alive;
  const locations = [[1,0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
      locations.forEach((location) =>{
        let temptile = [tile[0][0] + location[0], tile[0][1] + location[1]];
        for(let x = 0; x < aliveTiles.length; x++){
          if(temptile[0] === aliveTiles[x][0][0] && temptile[1] === aliveTiles[x][0][1]){
            count += 1;
          }        
        }
      });
      // aliveTiles.forEach((aliveTile) =>{
      //   locations.forEach((location) =>{
      //   if(aliveTile[0] === tile[0] + location[0] || aliveTile[1] === tile[1] + location[1])
      //     count += 1;
      //   });
      // });


  if(count <= 1 || count > 3){
    tile[0][2]=false;
    alive = false
  }
  else{
    alive = true;
  }  
  let tempGrid = grid;
  
  console.log(count)
  tempGrid[tile[1]] = tile[0];
  setGrid(tempGrid)
  
  return alive;

}

const checkZombies = () =>{
  let counts = {};
  let tempAlive = [];
  let alive = [];
  const locations = [[-1, -1, -numCols -1], [0, -1, -numCols], [1, -1, -numCols+1], [-1, 0, -1], [1,0, 1], [-1, 1, numCols-1], [0, 1, numCols],  [1, 1, numCols +1]]
  for(let x = 0; x < aliveTiles.length; x++){
    locations.forEach((location) =>{
      console.log(aliveTiles[x][1]);
      // tempAlive.push([aliveTiles[x][0][0], aliveTiles[x][0][1]])
      if(aliveTiles[x][1]+location[2] >= 0 && aliveTiles[x][1]+location[2] <= numCols * numRows - 1 && aliveTiles[x][0][0] + location[0] >= 0 && aliveTiles[x][0][1] + location[1] >= 0){
        
      let temptile = [aliveTiles[x][0][0] + location[0], aliveTiles[x][0][1] + location[1], "true", aliveTiles[x][1]+ location[2]];
      
        if(temptile[0] === aliveTiles[x][0][0] && temptile[1] === aliveTiles[x][0][1]){
        }
        else{
          tempAlive.push([temptile])
        }
      }

    });
  }
  console.log("Zombies:")
  console.log(tempAlive)
  tempAlive.forEach( (x) => { counts[x] = (counts[x] || 0) + 1; });
  console.log(counts)
  for (let key in counts){
    if(counts[key] === 3){
      let splitKey = key.split(",");
      alive.push([[Number(splitKey[0]), Number(splitKey[1]), Boolean(splitKey[2])], Number(splitKey[3])]);
      let tempGrid = grid
      tempGrid[splitKey[3]] = [Number(splitKey[0]), Number(splitKey[1]), Boolean(splitKey[2])];
      setGrid(tempGrid)
    }
  }
  console.log("alive");
  console.log(alive)
  return alive;
}

const handleClick = (e, pos, index) =>{
  pos[2] = !pos[2];
  if(pos[2]){
    let tempAlive = aliveTiles
    tempAlive.push([pos, index])
    console.log(aliveTiles);
    setAliveTiles(tempAlive)
  }
  else{
    let tempAlive = aliveTiles;
    tempAlive = tempAlive.filter(x => x[0][0] !== pos[0] || x[0][1] !== pos[1] || x[0][2]);
    setAliveTiles(tempAlive)
    
  }
  setGrid(grid => [...grid]);
}

const showDetails = (pos, index) =>{
  if(pos[2])
    console.log("pos: X-" +pos[0] + " Y-"+pos[1] + " index: " +index)

}


// const remakeGrid = () =>{
//     let tempAlive = aliveTiles
//     tempAlive.push([pos, index])
//     setAliveTiles(tempAlive)
// }



return (  
<div>
  <button onClick = {() => toggleGame()}> {isRunning ? 'Stop' : 'Start'}</button> 
  <div style = {{display:"grid", gridTemplateColumns: `repeat(${numRows}, 11px)`}} >
      {grid.map((data, index) => <div key = {`cell${data[0]}-${data[1]}`} id = {`cell${data[0]}-${data[1]}`} onClick = {(e) => handleClick(e, data, index)} onMouseEnter={() => showDetails(data, index)} style =  {{ width: 10, height: 10, border: "1px solid black", display: "inline-block", backgroundColor: data[2] ? "red" : "white"}}></div>)  }
  </div>
</div>   

);
}
export default Grid;
