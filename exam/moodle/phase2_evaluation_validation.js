// Le code pour valider les évaluations dans les devoirs Moodle
document.addEventListener("DOMContentLoaded", function(event) {
  if (!document.getElementById('id_submitbutton')) {
    return;
  }

  // create a new div nodes
  div_oups = document.createElement('div');
  div_oups.textContent = "Votre évaluation ne semble pas valide !";
  div_oups.classList.add('MyClass');
  div_oups.classList.add('validation-oups');

  div_ok = document.createElement('div');
  div_ok.textContent = "Votre évaluation et valide, sous condition que le numéro d'exercice est le bon.";
  div_ok.classList.add('validation-ok');

  // insert it
  buttondiv = document.getElementById('id_submitbutton').closest('.form-group.row');
  buttondiv.parentElement.insertBefore(div_ok, buttondiv);
  buttondiv.parentElement.insertBefore(div_oups, buttondiv);

  // validation regex
  const regex = /[\s\S]*:\s*(\d[A-Z]\d)\b[\s\S]*:\s*([0-5])\b[\s\S]*:\s*([0-5])\b[\s\S]*:\s*(\d+)\b/m;

  // listen for changes and validate
  text = document.getElementById('id_onlinetext_editor')
  function validate(evt) {
    if (regex.test(text.value)) {
      div_oups.style.display = 'none'
      div_ok.style.display = 'block'
    }
    else {
      div_oups.style.display = 'block'
      div_ok.style.display = 'none'
    }
  }
  text.addEventListener('input', validate);

  select = document.getElementById('menuonlinetext_editorformat');
  select.value = 2;  // on fixe le type du text à 'Format text'
  select.style.visibility = 'hidden';

  // validate for the first time
  validate();
  // if empty fill it
  if (text.value == '') {
    text.value =
      "- Code de l'exercice : \n" +
      "  - Lisibilité du document [0-5] : \n" +
      "  - Clarté et précision de l'énoncé [0-5] : \n" +
      "  - Temps nécessaire pour cet exercice [min] : \n";
  }
});
