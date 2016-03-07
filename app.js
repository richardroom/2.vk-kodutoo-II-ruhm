(function(){
   "use strict";

   var Homework = function(){

     // SEE ON SINGLETON PATTERN
     if(Homework.instance){
       return Homework.instance;
     }
     //this viitab Moosipurk fn
     Homework.instance = this;

     this.routes = Homework.routes;
     // this.routes['home-view'].render()


     // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     //console.log(this);

	 // hakkan hoidma koiki purke
	 this.jobs = [];

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
    this.init();
   };

   window.Homework = Homework; // Paneme muuutja külge

   Homework.routes = {
     'home-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
        // console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
      //   console.log('>>>>loend');

		 //simulatsioon laeb kaua
		 window.setTimeout(function(){
			 document.querySelector('.loading').innerHTML = 'Laetud!';
		 }, 1000);
       }
     },
     'manage-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
       }
     }
   };

   // Kõik funktsioonid lähevad Moosipurgi külge
   Homework.prototype = {

     init: function(){
      // console.log('Rakendus läks tööle!');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

	   //kui aadressireal ei ole hashi siis lisan juurde
	   if(!window.location.hash){
		   window.location.hash = 'home-view';
		   //routechange siin ei ole sees vaja, sest kasitsi muutmine kaivitab routechange
	   }else{
		   //esimesel kaivitamisel vaatame urli ule ja uuendame menuud
	   this.routeChange();
	   }

	   //saan katte purgid localStorage kui on
	   if(localStorage.jobs){
		   //vottan stringi ja teen tagasi objektideks
		   this.jobs = JSON.parse(localStorage.jobs);
		  // console.log('laadisin localStorageist massiivi' + this.jobs.length);

		   //tekitan loendi htmli
		   this.jobs.forEach(function(job){
			  var new_job = new Job(job.title, job.description, job.deadline);

			  var li = new_job.createHtmlElement();
			  document.querySelector('.list-of-jobs').appendChild(li);
		   });
		   }

       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-job').addEventListener('click', this.addNewClick.bind(this));
	   //kuulan trukkimist otsikastis
	   //document.querySelector('#search').addEventListener('keyup', this.search.bind(this));
     },

	 search: function(event){
		 //otsikasti vaartust
		// var needle = document.querySelector('#search').value.toLowerCase();
		// console.log(needle);

		 var list = document.querySelectorAll('ul.list-of-jobs li');
		// console.log(list);

		 for(var i = 0; i < list.length; i++){

			 var li = list[i];

			 //uhel listitemi sisu tekst
			 var stack = li.querySelector('.content').innerHTML.toLowerCase();

			 //kas otsisona on sisus olemas
			 if(stack.indexOf(needle) !== -1){
				 //olemas
				 li.style.display = 'list-item';
			 }else{
				 //ei ole, index on -1
				 li.style.display = 'none';
			 }
		 };
	 },


     addNewClick: function(event){
		 //salvestame purgi
		 //console.log(event);

		 var title = document.querySelector('.title').value;
		 var description = document.querySelector('.description').value;
     var deadline = document.querySelector('.deadline').value;

		 console.log(title + '' + description + '' + deadline);
		 //1. tekitan uue Jar'i
		 var new_job = new Job(title, description, deadline);

		 // lisan massiivi purgi
		 this.jobs.push(new_job);
		 console.log(JSON.stringify(this.jobs));
		 //JSONi stringina salvestan localStorageisse
		 localStorage.setItem('jobs', JSON.stringify(this.jobs));

		 //2. lisan selle htmli listi juurde
		 document.querySelector('.list-of-jobs').appendChild(new_job.createHtmlElement());

		 this.click_count++;
		 //console.log(this.click_count);

     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, võtan maha #
       this.currentRoute = location.hash.slice(1);
      // console.log(this.currentRoute);

	   //kas meil on selline leht olemas?
	   if(this.routes[this.currentRoute]){

		   //muudan menüü lingi aktiivseks
		   this.updateMenu();

		   this.routes[this.currentRoute].render();

	   }else{
		   //404 - ei olnud
	   }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) võtan maha aktiivse menüülingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; //MOOSIPURGI LOPP

   var Job = function(title, description, deadline){
	   this.title = title;
	   this.description = description;
     this.deadline = deadline;
	  // console.log('created new job');
    // console.log(title + '' + description + '' + deadline);
   };

   Job.prototype = {
	   createHtmlElement: function(){

		   var li = document.createElement('li');

		   var span = document.createElement('span');
		   span.className = 'letter';

		   var letter = document.createTextNode(this.title.charAt(0));
		   span.appendChild(letter);

		   li.appendChild(span);

		   var span_with_content = document.createElement('span');
		   span_with_content.className = 'content';

		   var content = document.createTextNode(this.title + ' | Kirjeldus: ' + this.description + ' | Tähtaeg: ' + this.deadline );
		   span_with_content.appendChild(content);


		   li.appendChild(span_with_content);

		   return li;
	   }
   };


   window.onload = function(){
     var app = new Homework();
   };

})();
