So, your job is to design and implement the non-AI part of a system that search and filters for related literature.
The system has two main goals:

Goal 1. Find information (in our case, this is scientific papers):

A) papers related to a topic defined informally (say, a textarea where somebody writes what they want, in plain English )

B) papers similar to one or more specific papers (in the paper text area I write either the paper title or the DOI)

Possibly, c) exclusions criteria, that is,  papers we are not interested in (this is a way to narrow down the search). Notice it might go inside A if we are smart enough with NLP

The output of this process is a list of papers with i) a confidence (how sure we are they are related) and ii) a method / reason, that is, why we believe they are related… why they are in the list

For the moment don’t worry about the magic part.
What we need to do is

A) mockups, even on pen and papers
B) later, backend for the non-AI part, meaning, node and DB
C) write all this in the readme or website so features and ideas are kept track of

With the usual tech, node express possibly travis GitHub Heroku, and I guess as DB Postgres with abundant use of JSON fields



Goal 2. Support a systematic process to literature search.
This includes goal 1 above first, only we need to explicitly trace in the system which user did what, at what time, and the detailed output, so that if somebody wants to verify what happened, they can

Then, based on the list above (or on a list of papers somebody uploads)  we

1) formally define exclusion criteria
2) have AI tag again paper with in or out, per criteria and overall (evgeny can explain this), with confident
3) let a human or set of humans take decisions, which can be either 
-manual (person manually tags papers as relevant or not, per criterion)
- rule based (exclude papers for which AI has confidence > 90%)
- or it can be to take decision on some papers as above, and crowdsource the rest

4) jorge, we may see that the expert while going through some papers start to tell us features also, maybe useful for machines too.
