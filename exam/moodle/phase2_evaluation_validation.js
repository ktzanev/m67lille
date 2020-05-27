document.addEventListener("DOMContentLoaded", function(event) {
  if (!document.getElementById('id_submitbutton')) {
    return;
  }
  // create a new div node
  div = document.createElement('div');
  div.textContent = 'Votre évaluation ne semble pas valide !';


  // insert it
  buttondiv = document.getElementById('id_submitbutton').closest('.form-group.row');
  buttondiv.parentElement.insertBefore(div, buttondiv);
  div.classList.add('MyClass');

  // validation regex
  const regex = /[\s\S]*:\s*(\d[A-Z]\d)\b[\s\S]*:\s*([0-5])\b[\s\S]*:\s*([0-5])\b[\s\S]*:\s*(\d+)\b/m;

  // listen for changes and validate
  text = document.getElementById('id_onlinetext_editor')
  function validate(evt) {
    if (regex.test(text.value)) {
      div.style.display = 'none'
    }
    else {
      div.style.display = 'block'
    }
  }
  text.addEventListener('input', validate);

  // validate for the first time
  validate();
  // if empty fill it
  if (text.value == '') {
    text.value =
      "- Code de l'exercice : \n" +
      "  - Lisibilité du document [0-5] : \n" +
      "  - Clarté et précision de l'énoncé [0-5] : \n" +
      "  - Temps nécessaire pour cet exercice [min]: \n";
  }
});
