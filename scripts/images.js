/* eslint-disable */

const sharp = require('sharp');
const imageOptim = require('imageoptim');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

const createIosVersion = async (filePath, fileName, fileExtension, dataDir) => {
  const generateIos = ora({
    text: `Generating the iOS images versions`,
    color: 'yellow',
  }).start();

  const image = sharp(filePath);

  const { width } = await image.metadata();

  // 3X
  await image.toFile(`${dataDir}/${fileName}@3x.${fileExtension}`);

  // 2X
  await image
    .resize(Math.round(parseInt(width / 1.5, 10)))
    .toFile(`${dataDir}/${fileName}@2x.${fileExtension}`);

  // 1X
  await image
    .resize(Math.round(parseInt(width / 3, 10)))
    .toFile(`${dataDir}/${fileName}.${fileExtension}`);

  generateIos.succeed('iOS images successfully generated');

  const optimizingIos = ora({
    text: `Optimizing the iOS images versions`,
    color: 'yellow',
  }).start();

  await imageOptim.optim([
    `${dataDir}/${fileName}.${fileExtension}`,
    `${dataDir}/${fileName}@2x.${fileExtension}`,
    `${dataDir}/${fileName}@3x.${fileExtension}`,
  ]);

  optimizingIos.succeed('iOS images successfully optimized');
};

const handleIos = (img, dir) => {
  const filePath = `${dir}${img}`;

  // Get image name and extension
  const dotIndex = img.indexOf('.');
  const fileName = img.slice(0, dotIndex);
  const fileExtension = img.slice(dotIndex + 1, img.length);

  // iOS config
  const iosPath = './../ios/react_native_starter_kit/Images.xcassets/';
  const imgFolderExtension = '.imageset';

  const jsonContentIos = `{
    "images" : [
      {
        "idiom" : "universal",
        "filename" : "${fileName}.${fileExtension}",
        "scale" : "1x"
      },
      {
        "idiom" : "universal",
        "filename" : "${fileName}@2x.${fileExtension}",
        "scale" : "2x"
      },
      {
        "idiom" : "universal",
        "filename" : "${fileName}@3x.${fileExtension}",
        "scale" : "3x"
      }
    ],
    "info" : {
      "version" : 1,
      "author" : "xcode"
    }
  }`;

  const dataDir = path.resolve(
    `${__dirname}${iosPath}${fileName}${imgFolderExtension}`
  );

  // Check if the image already exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    fs.writeFile(`${dataDir}/Contents.json`, jsonContentIos, 'utf8', () => {
      createIosVersion(filePath, fileName, fileExtension, dataDir);
    });
  } else {
    console.log(chalk.yellow('iOS image already imported!'));
  }
};

const imageGenerator = (img, dir = '') => {
  handleIos(img, dir);

  // // Android config
  // const androidPathx1 = './android/app/src/main/res/drawable-mdpi/';
  // const androidPathx2 = './android/app/src/main/res/drawable-xhdpi/';
  // const androidPathx3 = './android/app/src/main/res/drawable-xxhdpi/';
};

(() => {
  const argv = process.argv[2];
  if (!argv) {
    console.log(chalk.red('Missing image argument!'));
    process.exit();
  }

  if (argv.indexOf('.') > -1) {
    imageGenerator(argv);
  } else {
    console.log(
      chalk.red('Folders and multiple images are not supported yet!')
    );
  }
})();
