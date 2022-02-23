const alphabet = [...'a','b','c','d','f','g','h','i','j','k','l', 'm','n','o','p','q','r','s','t',
    'u','v','w','x','y','z','A','B','C','D', 'F','G','H','I','J',
    'K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

var specialChars = ("ß_;°§'*!@#$^&%*()+=-[]\/{}|:<>?,^").split("")

export const blockInvalidChar = e => (e.key.includes("^") ||  [...alphabet, ...specialChars].includes(e.key)) && e.preventDefault();