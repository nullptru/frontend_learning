class LbsController {
  constructor() {
    this.inBtn = document.getElementById('input-btn');
    this.outBtn = document.getElementById('output-btn');

    this.inTextArea = document.getElementById('input-data');
    this.outTextArea = document.getElementById('output-data');

    this.inError = document.getElementById('input-error');
    this.outError = document.getElementById('output-error');

    this.inFileInput = document.getElementById('input-file');
    this.outFileInput = document.getElementById('output-file');

    this.inImage = document.getElementById('input-canvas');

    this.inLink = document.getElementById('input-link')
    this.outLink = document.getElementById('output-link')
  }

  init() {
    this.inBtn.addEventListener('click', () => {
      this.inError.innerText = '';
      // getData
      const bindData = this.inTextArea.value;
      if (bindData === '') {
        this.inError.innerText = '请输入文本内容';
        return;
      }
      const inFile = this.inFileInput.files[0];
      if (!inFile) {
        this.inError.innerText = '请选择隐写的图片';
        return;
      } else if (!this.isFileAllow(inFile.type)) {
        this.inError.innerText = '请选择正确的图片格式';
        return;
      }
      this.inBtn.disabled = true;
      this.inBtn.innerText = "写入中...."
      // rewrite pixels
      this.encodeFile(inFile, bindData);
    });
    this.outBtn.addEventListener('click', () => {
      this.outError.innerText = '';
      // getData
      const outFile = this.outFileInput.files[0];
      if (!outFile) {
        this.outError.innerText = '请选择隐写的图片';
        return;
      } else if (!this.isFileAllow(outFile.type)) {
        this.outError.innerText = '请选择正确的图片格式';
        return;
      }
      this.outBtn.disabled = true;
      this.outBtn.innerText = "解析中..."
      // rewrite pixels
      this.decodeFile(outFile);
    });
  }

  encodeFile(file, data){
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        const canvasEle = document.createElement('canvas');
        const ctx = canvasEle.getContext('2d');
        canvasEle.width = image.width;
        canvasEle.height = image.height;
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const encodePixels = encodeLBS(imageData.data, text2bin(data));
        const newImage = new ImageData(new Uint8ClampedArray(encodePixels), image.width, image.height);
        ctx.putImageData(newImage, 0, 0);
        // generate download link
        // show link
        this.inLink.style.display = 'inline-block';
        this.inLink.download = `${file.name.split('.')[0]}_lbs.png`;
        this.inLink.href = canvasEle.toDataURL();
        this.inImage.src = canvasEle.toDataURL();
  
        this.inBtn.disabled = false;
        this.inBtn.innerText = "写入"
      }
    };
    reader.readAsDataURL(file);
  }

  decodeFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        const canvasEle = document.createElement('canvas');
        const ctx = canvasEle.getContext('2d');
        canvasEle.width = image.width;
        canvasEle.height = image.height;
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const decodeData = decodeLBS(imageData.data);
        if (!decodeData) {
          this.outError.innerText = "未发现写入数据，解析失败";
        } else {
          const resultData = bin2text(decodeData);
          this.outTextArea.value = resultData;
        }
        this.outBtn.disabled = false;
        this.outBtn.innerText = "解析"
      };
    };
    reader.readAsDataURL(file);
  }

  isFileAllow (mime) {
    const whiteList = ['image/png', 'image/jpg', 'image/jpeg'];
    return whiteList.includes(mime);
  }
}

const lbs = new LbsController();
lbs.init();