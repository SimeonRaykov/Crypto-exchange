import {
    FILTER_STATES,
  } from "constants/constants";

const sortObjectsByPrice = (obj, type) => {
    const keys = Object.keys(obj);
    const arr = [];
    for (let i = 0; i < keys.length; i += 1) {
        const currObj = {name:keys[i], price:obj[keys[i]]?.price}
        arr.push(currObj)
    }
    arr.sort((a,b)=>{
        if(type === FILTER_STATES.ASC){
            return a.price - b.price;
        }
        else{
            return b.price-a.price;
        }
    })

    const sortedObj = arr.reduce((acc, curr) => {
        const {name, price} = curr;
        acc[name] = {price};
        return acc;
    },{});

    return sortedObj;
}

export default sortObjectsByPrice;