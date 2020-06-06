// Le fichier js contenant la logique de validation
// pour la phase 3




const re_solution = /^\s*(\d[A-Z]\d_[A-Z]\d[A-Z])[^:]*:\s*((?:\d\s+){1,3}\d)\s*$/;
const re_debut_solution = /^\s*(\d[A-Z]\d_[A-Z]\d[A-Z])/;
const re_sujet = /^\s*(\d[A-Z]\d)[^_:]*:\s*([A-D]\s+[A-D])\s*$/;
const re_debut_sujet = /^\s*(\d[A-Z]\d)[^_]/;


var app = new Vue({
  el: '#app',
  data         : {
    document_txt      : '',
    solutions         : [],
    erreurs_solutions : [],
    sujets            : [],
    erreurs_sujets    : [],
    ignores           : '',
    filename          : '',
    valide            : false,
    nb_solutions_ok   : true,
    notxt             : false
  },
  watch: {
    document_txt: function (val) {
      const lines = this.document_txt.split('\n');

      this.solutions.length = 0; // clear array but keep it
      this.erreurs_solutions.length = 0;
      this.sujets.length = 0; // clear array but keep it
      this.erreurs_sujets.length = 0;
      this.ignores = "";

      for (let l of lines) {
        l = l.trim();

        // -------------- si vérifie regex de solutions
        if ((m = re_solution.exec(l)) !== null) {
          const code_solution = m[1];
          const code_exo = code_solution.split("_")[0];
          const notes = m[2].trim().split(/\s+/);

          // -------------- exo valide ?
          if (!(code_exo in nb_questions)) {
            this.erreurs_solutions.push({
              "code_solution" : code_solution,
              "code_exo" : code_exo,
              "type" : "code",
              "ligne" : l
            });
          }
          // -------------- bon nb de questions ?
          else if (notes.length != nb_questions[code_exo]) {
            this.erreurs_solutions.push({
              "code_solution" : code_solution,
              "code_exo" : code_exo,
              "type" : "questions",
              "quastions" : nb_questions[code_exo],
              "evaluations" : notes.length,
              "ligne" : l
            });
          }
          // -------------- solution ok
          else {
            this.solutions.push({
              "code_solution" : m[1],
              "code_exo" : code_exo,
              "notes" : notes
            });
          }
        }
        // -------------- début d'une solutions mais ...
        else if ((m = re_debut_solution.exec(l)) !== null) {
          this.erreurs_solutions.push({
            "code_solution" : m[1],
            "code_exo" : m[1].split("_")[0],
            "type" : "regex",
            "ligne" : l
          });
        }
        // -------------- si vérifie regex d'un sujet
        else if ((m = re_sujet.exec(l)) !== null) {
          const code_exo = m[1];
          const notes = m[2].trim().split(/\s+/);

          // -------------- exo valide ?
          if (!(code_exo in nb_questions)) {
            this.erreurs_sujets.push({
              "code_exo" : code_exo,
              "type" : "code",
              "ligne" : l
            });
          // -------------- sujet ok
          } else {
            this.sujets.push({
              "code_exo" : code_exo,
              "notes" : notes
            });
          }
        }
        // -------------- début d'un sujet mais ...
        else if ((m = re_debut_sujet.exec(l)) !== null) {
          this.erreurs_sujets.push({
            "code_exo" : m[1],
            "type" : "regex",
            "ligne" : l
          });
        }
        // -------------- sinon : lignes ignorés
        else if (l.length > 0){
          this.ignores += l + "\n";
        }
      }

      // et à la fin on decide valide ou pas.
      this.nb_solutions_ok = (this.solutions.length + this.erreurs_solutions.length) % 3 == 0
      this.valide = this.nb_solutions_ok
                    && (this.erreurs_solutions.length == 0)
                    && (this.erreurs_sujets.length == 0)
                    && (this.sujets.length > 0)
                    && (this.solutions.length > 0)
                    ;
    }
  },
  methods: {
    // Will be fired by our '@drop.stop.prevent'; in this case, when a file is dropped over our app
    onDrop(e) {
      if ("dataTransfer" in e) {
        file = e.dataTransfer.files[0];
      } else if ("target" in e) {
        file = e.target.files[0];
      } else {
        return;
      }
      app.filename = file.name;
      if (!app.filename.endsWith(".txt")) {
        app.filename = '';
        app.notxt = true;
        setTimeout(() => app.notxt = false, 2100);
        return
      }
      // create new reader
      var encoding = "ISO-8859-1"
      var reader = new FileReader();
      // when the reader finish to read the file
      reader.onload = function(e) {
          // si l'encodage est bien Windows ou UTF-8
          if (encoding == "ISO-8859-1" && e.target.result.search("Ã©") > 0) {
            encoding = "UTF-8"
            reader.readAsText(file, encoding);
          }
          else {
            app.document_txt = e.target.result;
          }
      };
      // when the reader to read the file
      reader.readAsText(file, encoding);
    },
    DownloadTextFile(e) {
        const text = app.document_txt
        const filename = app.filename || "Prenom Nom - phase 3 - evaluations.txt"

        // window.URL = window.URL || window.webkitURL;
        if (window.Blob) {
          // new style
          var blob = new Blob([text], {encoding:"UTF-8",type:"text/plain;charset=UTF-8"});
        }
        else if (window.BlobBuilder) {
          // old scool
          window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
                              window.MozBlobBuilder || window.MSBlobBuilder;
          var bb = new BlobBuilder();
          bb.append(text);
          var blob = bb.getBlob(mime);
        }
        else {
          console.log('Problème : pas de Blob, ni de BlobBuilder :(')
        }

        saveAs(blob, filename);
      },
  },
  created: function () {
    this.document_txt ='';
  }
})


