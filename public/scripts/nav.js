var hamburger = document.querySelector(".hamburger")
var navLink   = document.querySelector(".navLinks")
var nav       = document.querySelector("nav")
var items     = document.querySelectorAll(".navItems")
var head      = document.querySelector(".new")
var head1     = document.querySelector(".options")
var head2     = document.querySelector(".options1")
var request   = document.querySelector(".request")
var msg       = document.querySelector(".msg")


hamburger.addEventListener("click",function(){
	navLink.classList.toggle("open")
	nav.classList.toggle("fixed-top")
	if(msg){
		msg.classList.toggle("msg-open")
	}else{
		if(head){
			head.classList.toggle("nav-open")
		}
		if(head1){
			head1.classList.toggle("cont-index")
		}
		if(head2){
			head2.classList.toggle("cont-index1")
		}
		if(request){
			request.classList.toggle("request-open")
		}		
	}
	items.forEach(function(item){
		item.style.opacity = ""+(1-parseInt(item.style.opacity))
	})
})

var form = document.querySelector(".comment-form")
var btn  = document.querySelector(".add-comment")
var show = document.querySelector(".show-comments")

if(btn){
	btn.addEventListener("click",function(){
		console.log("clicked")
		show.classList.toggle("show-open")
		form.classList.toggle("open-form")
	})	
}




