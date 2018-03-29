const text2bin = (str) => {
  const bytes = encodeUtf8(str);
  const len = bytes.length;
  let binStr = '';

  for(let i = 0; i < len; i += 1) {
    binStr += padNumber(bytes[i].toString(2), 8);
  }
  return binStr;
};

const bin2text = (binStr) => {
  const len = binStr.length;
  let bytes = [];
  let current = '';

  for (let i = 0; i < len; i += 1) {
    if ((i + 1) % 8 === 0) {
      current += binStr[i];
      bytes.push(parseInt(current, 2));
      current = '';
    } else {
      current += binStr[i];
    }
  }

  return decodeUtf8(bytes);
}

const padNumber = (num, fill) => {
  var len = ('' + num).length;
  return (Array(
      fill > len ? fill - len + 1 || 0 : 0
  ).join(0) + num);
}

const encodeUtf8 = (str) => {
  const encodeStr = encodeURIComponent(str);
  const bytes = [];
  for (let i = 0; i < encodeStr.length; i++) {
    const c = encodeStr.charAt(i);
    if (c === '%') {
        const hex = encodeStr.charAt(i + 1) + encodeStr.charAt(i + 2);
        const hexVal = parseInt(hex, 16);
        bytes.push(hexVal);
        i += 2;
    } else bytes.push(c.charCodeAt(0));
  }
  return bytes;
};

const decodeUtf8 = (bytes) => {
  let encoded = "";
  for (let i = 0; i < bytes.length; i++) {
      encoded += '%' + padNumber(bytes[i].toString(16), 2);
  }
  return decodeURIComponent(encoded);
};


const encodeLBS = (imagePixels, binData) => {
  // 作为起始与终止
  const newPixels = [...imagePixels];
  const inData = '1111111111111111' + binData + '1111111111111111';
  let len = imagePixels.length;
  let dataLen = inData.length;
  for (let i = 0, j = 0; i < len; i += 1) {
    if (j >= dataLen) break;
    if ((i + 1) % 4 === 0) continue; // a通道不处理
    newPixels[i] = imagePixels[i] - imagePixels[i] % 2 + parseInt(inData[j]);
    j += 1;
  }
  return newPixels;
}

const decodeLBS = (imagePixels) => {
  let result = '';
  let len = imagePixels.length;
  let endCount = 0;
  let bit = '';
  let hasData = true;

  // 检验是否含有数据
  for (let i = 0; i < 16; i += 1) {
    if ((i + 1) % 4 === 0) continue; // a通道不处理
    bit = imagePixels[i] % 2;
    if (bit === 0) { hasData = false; break; }
  }
  bit = '';
  if (!hasData) { return "" }

  for (let i = 0; i < len; i += 1) {
    if (endCount >= 16 && i > 32 && result.length % 8 === 0) {
      break;
    }
    if ((i + 1) % 4 === 0) continue; // a通道不处理
    bit = imagePixels[i] % 2;
    result += bit;
    if (bit === 0) {
      endCount = 0
    } else {
      endCount += 1;
    }
  }
  return result.substr(16, result.length - 32);
}