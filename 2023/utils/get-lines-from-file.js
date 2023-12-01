const NEWLINE_REGEX = /\r\n|\r|\n/;

const getLinesFromFile = async (filePath) => {
  const text = await Deno.readTextFile(filePath);
  const lines = text.split(NEWLINE_REGEX);
  return lines;
};

export default getLinesFromFile;
