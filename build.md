setup shadcn prettier eslint config 
our custom tailwind config
then add fonts in app folder
then refactor the rootlayout using our fonts nd custom tailwind 


NOW WE NEED TO MAKE HOMEPAGE
see the auth page wont have a naviagtion bar (see the figma design) but rest all of the pages will have a navigation bar so
now we need different folders layout tsx file for them

start with header comp

then homepage
homepage consist of header in top and below there are 2 cards one had a tetx and other has book image dan brown origin
and below that there are cards of books under section popular books 
IN NUTSHELL AT TOP WE WILL DISPLAY THE OVERVIEW OF A NEW BOOK ADDED ALONG WITH IMAGE IN RIGHT SIDE 
ON LEFT SIDE WE will display the information details about book nd right will show image and then below we will have a popular books section showiung cards of boosk 
so in homepage we have two diff section bookoverview and booklist(for popular books)

for now add constant data to build the bookoverview nd booklist comp using sample data
for bookcover i mean the image in right side we will make it as a  new comp and use it inside book overview passing down the props 
again now u need one more comp inside bookcover thst is bookcoversvg so u see how we break components 