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
update the rootlayout to use session provider


Sign Up Process:

User fills form: name, email, university ID, password
File Upload: University card image via ImageKit
Server validation & rate limiting
Password hashing & user creation
Workflow trigger (external service)
Automatic sign-in
Redirect to home page
Sign In Process:

Email & password input
Server validation & rate limiting
Database credential verification
JWT token creation
Session establishment


1. User submits form
   ↓
2. AuthForm.tsx → handleSubmit()
   ↓
3. signUp() or signInWithCredentials() action
   ↓
4. Rate limiting check
   ↓
5. Database operations (Drizzle ORM)
   ↓
6. NextAuth.js session creation
   ↓
7. Client-side redirect
   ↓
8. Session-protected routes access

FILE UPLOAD FLOW
1. User selects file
   ↓
2. FileUpload component triggers
   ↓
3. GET /api/imageKit (authentication)
   ↓
4. ImageKit SDK upload
   ↓
5. Success callback updates form
   ↓
6. File URL stored in form state
   ↓
7. Submitted with user registration


Auth Actions (auth.ts):
signUp() Function:

✅ Rate limiting check
✅ Email uniqueness validation
✅ Password hashing (bcryptjs)
✅ User creation in database
✅ Workflow trigger (onboarding)
✅ Auto sign-in after registration
signInWithCredentials() Function:

✅ Rate limiting check
✅ Credential validation
✅ NextAuth signIn call
✅ Error handling



NOW WE NEED TO SETUP UPSTASH REDIS WORKFLOW BECUASE WE WANT TO RATE LIMIT THE REQUEST MADE TO AUTH PAGES 
SO WE NEED TO MAKE  ARATE LIMITER WHIUCH WE CAN ADD IN ANY COMPO SERVER ACTION
build the ratelimit built and redis file in lib and add that rate limiter in signup serve action first 
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
add ratelimit in signupcredential server action too 

make a new page for too-fast 
later we will use workflow from upsatsh which will be used to send notifivatrion to user when their book borrowed is due nd much more like imolementing user onboarding flow 

we have done auth , rate limit ,ui nd all but for industry level we need one more thing 
we need that user must comeback to our app else what we will do with A good ui or good backend 
if user neevr comes back to our app , he aint reminded then the issue is there 
to solve this we will use user onboarding flow 
like duolingo app tracks i a user has not  logged in for a specific number of days and if that happens tjey send a push notification or an email also zomato do thius like emailing swiggy too 
developer use workflow for this 
like a user has not logged if for 3 days then send an sms/email to user tocomeback nd use app
WORKFLOWS ARE GREAT 
SCHEDULKE EVENTS AND TRIGGER THEM 
NOW go to qstash workflows see docs for nextjs nd follow THAT 
In Upstash Workflow, every workflow is exposed as an endpoint. Every endpoint you expose using the SDK’s serve() function acts as a workflow that can be triggered independently.
In Next.js, these endpoints are implemented as API routes.
Create the file according to your router setup:
App Router → put the endpoint under app/api
now make a file worfklow ts inside lib

now qtash trigger the events but we still need to use other thing to send email we will use resend
we will write resend email code inside workflow 


NOW WE NEED TO MAKE ADMIN DASHBOARD 
SO WE NEED A DIFFERENT APP NOW FOR ADMIN PANEL MONO REPO
NOW ADMIN PANEL IS COMPLETE DIFFERENT FROM USER PANEL I MEAN ALL UI AND ALL 
SO AGAIN INSIDE ADMIN FOLDER WE NEED TO COMPLETELY MAKE DIFFERRENT FOLDERS ROOT ND UI COMP SIDEBAR NAVABR ND HOME HERO SECTION ND ALL
