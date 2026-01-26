export function getRandomInt(min, max=null) {
	if (max == null) { max = min; min = 0 }	max--;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const alphanumeric = [
  // Digits
  '0','1','2','3','4','5','6','7','8','9',
  // Uppercase letters
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
  // Lowercase letters
  'a','b','c','d','e','f','g','h','i','j','k','l','m',
  'n','o','p','q','r','s','t','u','v','w','x','y','z'
];
