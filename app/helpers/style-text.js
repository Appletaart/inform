import { helper } from '@ember/component/helper';

export default helper(function styleText(params/*, hash*/) {
  const [text] = params;
  const $box = document.getElementById('text')
  // const selectText = text.match(/\(([^)]+)\)/)[1]
  const regex = /(\()([^)]+)(\))/g;
  const highlight = text.replace(regex, "$1<mark>$2</mark>$3")
  return $box.innerHTML = highlight;
});
