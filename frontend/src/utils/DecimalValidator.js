const count = (str) => {
    const re = /\./g;
    return ((str || '').match(re) || []).length
}

export const decimalValidator = (e, max) => { 
    if(count(e.target.value) <= 1 && (!max || !e.target.value || parseFloat(e.target.value) < max && parseFloat(e.target.value) > 0  )) {
            return true;
    } 

    return false;
}; 