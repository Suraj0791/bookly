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
so once we are done with book cover nd bookcoversvg then move to booklist comp


now again we see earlier we thought ki sirf hamara homepage 2 part mai divide hai ek overview and ek booklist but when we started building bookoverview we got too many mini comps
now as we go to booklist again we can see it consist of bookcard many cards 


so now finally our homepage done header homepage done 
so now lets make the auth ui now which user will see before homepage 
so we will make validation.ts file using zod inside lib folder for our auth schema validation and then we will make two routes 
signi-in ans sign-up page and a authform .tsx which will use map to render all validations field 
this is just a ui setup now 

before setting actual backend nd db 
lets setup imagekit
add env of imagelit , make a config file now add there the env , make a comp imgupload/fileupload
then we will make an api route api/auth/imagekit this folder inside route.ts for authenticating

in imageupload file we need to make authenticator function which will hit the image route 

at this point we only deal with image upload we will add more things ater on this file 
next make a db folder databse folder nd add file drizle and add configurtaion 
next we setup schema inside database folder nd then setup drizlle.config.ts file


now we will use unite i mean auth in this app tull now we hgave onlyauth ui 
now as we had setup database nd schema lest unit auth.js 


so we need to build now a auth.ts file in root add provider session nd all there nd then a ...nextauth folder inside aiuth folder and route file for auth and then a middleware.ts file in root of project 

now we will crate a server action of signing up of ouyr user 
always remember to keep the types interface in types.d.ts
then in actions folder inside lib folder make  auth.ts file and we will write two server fucntion one for signinwith credecntila sand one for signup 
