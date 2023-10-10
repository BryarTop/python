===============================================================================
Jira Scheduler Import
===============================================================================

Jira's Scheduler addon has a bulk-update option, but requires that the data is 
imported via XML. So this project is an attempt to create a systematic XML file
from a .csv file. 

I have created the initial XML template, I'll create a couple of tester specs 
to ensure that I'm capturing the correct values on the .csv file. 

===============================================================================
TypeScript Breakdown
===============================================================================

Each one of the ts functions is an attempt to help users view ongoing specs as 
they create them in Excel and to replace the plaintext values with those that 
the import XML doc will be able to send to Jira. 

One Function logs a new recurring spec and the second recalls a spec that has
previously been recorded so that it can be udpated or edited. 
