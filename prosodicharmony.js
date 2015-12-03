

function PhoneticTextDocument(textStream)
{
	this.text = textStream;
}

PhoneticTextDocument.prototype.getText = function ()
{
	return this.text;
}

PhoneticTextDocument.prototype.getText = function ()
{
	return this.text;
}

function TraditionalTextDocument(textStream)
{
	this.text = textStream;
}

function ProsodicTextProcessor()
{
	// may not have any properties
	this.vowels = Vowels;
	this.consonants = Consonants;
	this.vowels2graph = Vowels2Graph;	// TODO: import all these from CSV
	this.vowels3graph = Vowels3Graph;	// not really ?!

	// NB just about any consonant can be doubled
	this.doubleConsonants = doubleConsonants;

	this.consonants2graph = Consonants2Graph;
	this.consonants3graph = Consonants3Graph;

	//this.consonants2graph.concat(this.doubleConsonants);	// for the moment, add geminates to bigraph consonants
	
	this.syllableSplittingRegularExpression = "";
	
	//global variables for the moment - TODO: CSV import
	
	this.breakingPunctuation = BreakingPunctuation;			// inter-syllable breaking punctuation
	this.nonBreakingPunctuation = NonBreakingPunctuation;	// intra-syllable non-breaking punctuation
}

ProsodicTextProcessor.prototype.processPhoneticText = function(textStream)
{
	// process text stream
	// 
}

ProsodicTextProcessor.prototype.buildGraphsRegularExpression = function(graph1Array,boolDoubleGraph,graph2Array,graph3Array)
{
	// function - intended for building and returning a find-all-vowels or find-all-consonants regular expression
	// arguments 1,3 and 4: arrays of graphs, meant to be 1,2 & 3 characters long, meant also to be obtained from the ProsodicTextProcessor's properties via get functions
	// second argument, boolean, determines whether or not a list is compiled, of doubles of all single graphs eg. bb dd ff gg ...
	
	var regCounter = 0;
	
	var graphsRegEx = "";	
	var graph1Set = "[";	// start with character class / character set start '['
	var doubleGraph1Set = "";
	var graph2Set = "";
	var graph3Set = "";
	
	while (graph1Array[regCounter])	// take basic 1-graph character list - loop through make character class / character set within brackets
	{
		graph1Set = graph1Set + graph1Array[regCounter];
		regCounter++;
	}
	graph1Set = graph1Set + ']';		// add close bracket to complete 1-graph character set clause
	
	regCounter = 0;

	// in case double graphs allowed, loop through and add double characters to regular expression, NB must be in reg ex BEFORE character class (else incorrect capture of single characters occurs)
	while (graph1Array[regCounter])		// take basic 1-graph character list - loop through make character class / character set within brackets
	{
		doubleGraph1Set = doubleGraph1Set + graph1Array[regCounter] + graph1Array[regCounter] + '|';	// add double graph plus | 'or' operator
		regCounter++;
	}	
	
	doubleGraph1Set = doubleGraph1Set.substring(0,doubleGraph1Set.length - 1);	// + ')';
	
	regCounter = 0;
	
    // this would really be little other than showing off - not going to bother - would create hybrid bigraph/trigraph eg r?dh thr? s?qw - space saved in reg ex would not be worth the complication inflicted on you, gentle comment reader. Or on me, for that matter.
	
	// access bigraphs list - loop through and prepend each to single graphs character set
	// access trigraphs list - loop through each trigraph
	// for each trigraph, loop for each bigraph (hedged by | operator), search within that trigraph for index at which bigraph matches (will be 0 if bigraph d'match starting 2 characters of trigraph, 1 if at final 2 characters)
	// if match found, set bigraph now to be instead trigraph with ? inserted/spliced in at index 1 if search index 0, or appended at end (length i.e. 3) else if search index 1  - search for this
	// do not use this ex-bigraph again (next time add full trigraph, just in case)
	// (then set condition exit loop for this trigraph or to not assign any more values)
	// if match not found, add full trigraph

	
	while (graph2Array[regCounter])	// take basic 1-graph character list - loop through make character class / character set within brackets
	{
		graph2Set = graph2Set + graph2Array[regCounter] + '|';
		regCounter++;
	}

	graph2Set = graph2Set.substring(0,graph2Set.length - 1);	// + ')';
	
	regCounter = 0;

	
	while (graph3Array[regCounter])	// take basic 1-graph character list - loop through make character class / character set within brackets
	{
		graph3Set = graph3Set + graph3Array[regCounter] + '|';
		regCounter++;
	}

	graph3Set = graph3Set.substring(0,graph3Set.length - 1);	// + ')';
	
	regCounter = 0;
	
	
	// trigraphs must be prepended to reg ex, then bigraphs, then doubles, then single character set (else suboptimal matching occurs)
	
	if (boolDoubleGraph)
	{
		doubleGraph1Set = doubleGraph1Set + "|";
	}
	else
	{
		doubleGraph1Set = "";
	}
	graphsRegEx = new RegExp( "(" + graph3Set + "|" + graph2Set + "|" + doubleGraph1Set + graph1Set + ")", "i") ;	// build reg ex and make case insensitive
	
	// could expand this for quadgraphs and pentagraphs (should they exist)

	// check for any accidental empty adjacent || characters
	// lose any blank elements (especially at start and finish)
	return graphsRegEx;

}		// end of buildGraphsRegularExpression


ProsodicTextProcessor.prototype.getAllVowelsRegularExpression = function(graph1Array,boolDoubleGraph,graph2Array,graph3Array)
{
	return this.buildGraphsRegularExpression(this.vowels,false,this.vowels2graph,this.vowels3graph);

	this.consonants = Consonants;
	this.consonants2graph = Consonants2Graph;
	this.consonants3graph = Consonants3Graph;

	// returns a regular expression to find all vowels, as defined by settings set into ProsodicTextProcessor	

}

ProsodicTextProcessor.prototype.getAllConsonantsRegularExpression = function()
{
	return this.buildGraphsRegularExpression(this.consonants,false,this.consonants2graph,this.vowconsonants3graphels3graph);

	// returns a regular expression to find all consonants, as defined by settings set into ProsodicTextProcessor 

}

//ctrlv

ProsodicTextProcessor.prototype.splitTextToVocalAndNonVocal = function(textToSplit)
{	
	// returns array of text split into elements (or 'words') of vocal and/or non-vocal text
	// NB returned elments beginning with alphabetic characters or apostrophes or dashes MUST be vocal; otherwise, non-vocal
	var regex = /\b([a-zA-Z\'\-]{1,10})/
	var splitText = textToSplit.split(regex);	// split text on actual words (apostrophes or dashes included) - and capture (i.e. don't discard)
	var lineText = new Array();
	var textElement; 
	
	
	for (i = 0;i < splitText.length; i++) 
	{																// if acceptable character at start of 'word'
		if (splitText[i].charAt(0).match(/\b([a-zA-Z\'\-]{1,10})/))	
		{
			for (j = i;j > -1; j--)	// look for \# comment character, (backwards from current 'word') in every previous 'word' of line 
			{
				if (splitText[j].indexOf('#') != -1)	// if /# (comment character) found in any previous 'word' of line 	
				{
					// must be a comment - do no assign this as non-vocalic 'word' - leave to be assigned as non-vocalic 'word'
					// next element in line (which must be also a comment, of course, and therefore will be assigned non-vocalic type likewise: deja vu)
					// redundancy in the search here - TODO should implement flag or other means to either skip this check, or mandate this clause once comment /# character found 
					var nonVocalicText = new NonVocalicText(splitText[i]);	// a comment, or line number, or similar
					lineText.push(nonVocalicText);
					 
				}
				else if (j == 0)	// if all previous text elements searched and no # found, this cannot be a comment
				{					
					var vocalicText = new VocalicText(splitText[i],this); 		// test passed - assign as a 'genuine' vocalic 'word' (using this prosodic Text Processor)
					vocalicText.setSyllables(this.syllabify(vocalicText,this));	// compute and define syllables within vocalic text
					lineText.push(vocalicText);
				} 
			}

		}
		else	// if first character not of a vocalic type at all, must be a non-vocalic 'word'
		{
			var nonVocalicText = new NonVocalicText(splitText[i]);	// a comment, or line number, or similar
			lineText.push(nonVocalicText);
		}	// end of if/else check for acceptability of 'word' as vocalic or non-vocalic
		
	}	// end of for loop through 'words' of line input

	return lineText;
	// need to assign elements as vocal or non-vocal
	// need to assign text preceded by /# as non-vocal (comments &c)
}

ProsodicTextProcessor.prototype.splitTextByLine = function(textToSplit)
{
	// returns array of elements, each element a line of text
	return textToSplit.split(/\n/);		// use reg ex newline, return array of elements, each a line
}



ProsodicTextProcessor.prototype.getVowels = function()
{
	return this.vowels;
}

ProsodicTextProcessor.prototype.getVowels2Graph = function()
{
	return this.vowels2graph;	
}

ProsodicTextProcessor.prototype.getVowels3Graph = function()
{
	return this.vowels3graph;		
}

ProsodicTextProcessor.prototype.getConsonants = function()
{
	return this.consonants;
}

ProsodicTextProcessor.prototype.getConsonants2Graph = function()
{
	return this.consonants2graph;	
}

ProsodicTextProcessor.prototype.getConsonants3Graph = function()
{
	return this.consonants3graph;		
}

ProsodicTextProcessor.prototype.getBreakingPunctuation = function()
{
	return this.breakingPunctuation;	
}

ProsodicTextProcessor.prototype.getNonBreakingPunctuation = function()
{
	return this.nonBreakingPunctuation;		
}



/*

ProsodicTextProcessor.prototype. = function()
{
	
}

ProsodicTextProcessor.prototype. = function()
{
	
}

ProsodicTextProcessor.prototype. = function()
{
	
}


ProsodicTextProcessor.prototype. = function()
{
	
}

ProsodicTextProcessor.prototype. = function()
{
	
}

ProsodicTextProcessor.prototype. = function()
{
	
}

*/

//read in vowels
//read in consonants
//read in 2-graph vowels
//read in 2-graph consonants
//read in 3-graph vowels
//read in 3-graph consonants



function DisplayTextLine(textLines)
{
	this.lines = textLines;	// an array of syllabic and non-syllabic elements
}

DisplayTextLine.prototype.getText = function ()
{
	return this.text;	// return array of syllabic and non-syllabic elements
}



function DisplayText(textToDisplay)
{
	this.text = textToDisplay;		// this is the text in/from objects of a form ready to display
	this.lines = new Array();		// lines should be an array (of lines)?
	this.lines = textToDisplay.split(/\n/);	// split text stream on new line (reg ex) to lines of text
	return this.lines.length;			// return total number of lines
}

DisplayText.prototype.getLines = function ()
{
	return this.lines;	// return all lines collection/array
}

DisplayText.prototype.setLines = function (textLines)
{
	this.lines = textLines;	// return all lines collection/array
}

DisplayText.prototype.arrangeLines = function ()
{	
	// arranges text into an array, where each line is an element in the array 
	// returns number of lines

	this.lines = this.text.split(/\n/);	// split text stream on new line (reg ex)
	return this.lines.length;			// return total number of lines
}

DisplayText.prototype.arrangeLines = function ()
{
	this.lines = this.text.split(/\n/);	// split text stream on new line (reg ex)
	return this.lines.length;			// return total number of lines	
}


DisplayText.prototype.getLineByNumber = function (lineNumber)
{
	return this.lines[lineNumber];	// return the line indexed by number
}

DisplayText.prototype.setLineByNumber = function (lineNumber,lineText)
{
	this.lines[lineNumber] = lineText;	// set the line indexed by number (probably not with actual text, likely an array of vocalic & non-vocalic elements)
}

DisplayText.prototype.getNumberOfLines = function ()
{
	return this.lines.length;	// return length of lines array (i.e. number of lines)
}



DisplayText.prototype.addLine = function (lineText)
{
	this.lines.push(lineText);
}


function VocalicText(vocalicText)
{
	this.text = vocalicText;
	this.syllables = new Array();
}

VocalicText.prototype.getText = function ()
{
	
	if (this.syllables.length ==0)		// if syllable not yet set
	{
		return this.text;		// just return basic text
	}
	else	// otherwise if syllables have been defined
	{	
		var vocalicTextString = "";
		for (var i = 0;i < this.syllables.length;i++)
		{
			vocalicTextString = vocalicTextString + this.syllables[i];	// build up vocalic string from syllables
		}
		return vocalicTextString;
	}
	
}

VocalicText.prototype.getLineText = function ()		// NB function to return crude text of vocalic text, not syllables (which are ...?)
{
	return this.text;	
}

VocalicText.prototype.setSyllables = function(syllableArray)
{
	this.syllables = syllableArray;
}

VocalicText.prototype.getSyllables = function()
{
	return this.syllables;
}



function NonVocalicText(nonVocalicText)
{
	this.text = nonVocalicText; 	
}

NonVocalicText.prototype.getText = function ()
{
	return this.text;
}

function Syllable(text, onset, nucleus, coda)		// a syllable object // could perhaps have derived this from vocalic text, but might cause problems (constructor.name?) 
{
	this.text = text;	// perhaps rename to .getText for compatibility with vocalic/non-vocalic text objects?
	this.onset = onset;
	this.nucleus = nucleus;
	this.coda = coda;
	this.syllableGraphic = null;	// no graphic for this syllable to begin with
	this.stressed = false;			// no stress by default
	this.type = "";					// syllable type - V, VC, CVC, CV,
	this.Soundexesque = "";			// Soundex-like string for phonetic comparison
	
	// this.previousSyllable = null;	// previous syllable in vocalic text group/'word'	// possibly obtainable by reference to vocalicText's syllableArray
	// this.nextSyllable = null;		// next syllable in vocalic text group/'word'
}


Syllable.prototype.setText = function (syllableInText)
{
	this.text = syllableInText;
}

Syllable.prototype.getText = function ()
{
	return this.text;
}

Syllable.prototype.setOnset = function (onsetInText)
{
	this.onset = onsetInText;
}

Syllable.prototype.getOnset = function ()
{
	return this.onset;
}

Syllable.prototype.setNucleus = function (nucleusInText)
{
	this.nucleus = nucleusInText;
}

Syllable.prototype.getNucleus = function ()
{
	return this.nucleus;
}

Syllable.prototype.setCoda = function (codaInText)
{
	this.coda = codaInText;
}

Syllable.prototype.getCoda = function ()
{
	return this.coda;
}

Syllable.prototype.setStress = function (boolStress)
{
	this.stressed = boolStress;	
}

Syllable.prototype.getStress = function ()
{
	return this.stressed;	// returns boolean 'stressed' property of syllable, reporting whether syllable stressed or not
}

Syllable.prototype.setType = function (syllableType)
{
	this.type = syllableType;
}

Syllable.prototype.getType = function ()
{
	return this.type;
}




/*
function syllabifyIterative(vocalicText)	// version of syllabify, using iterative (not regular-expression-heavy) methods
{
	// take single vocalic text as character or array of vocalic texts ?
	// split into syllables, and each syllable into syllable parts (onset/nucleus/coda)
	// return a string of syllables ?
	
	var syllable = new Syllable("","","","");	// blank new syllable
	var syllableArray = new Array();
	
	var listCompilationCounter = 0;
	
	var punctuationSearch = "";
	var vowelList = "";
	var consonantList = "";

	var characterCounter = 0;	// v important - this counter of position within 'word' / vocalic text should be incremented within the check-for-bi-or-tri-graphs function (to which tis passed as argument)

	// needs a bit more try{} and catch{}, to be safe


	while (nonBreakingPunctuation[listCompilationCounter])	// make a list of non-syllable-breaking punctuation for which to look
		{
			punctuationSearch.concat(String.fromCharCode(92) + nonBreakingPunctuation[punctuationSearchCounter])
			listCompilationCounter++;
		}
	
	listCompilationCounter = 0;	// reset array counter

	while (prosodicTextProcessor.vowels[listCompilationCounter])	// make/get a list of acceptable vowels
	{
		vowelList.concat(prosodicTextProcessor.vowels[punctuationSearchCounter])
		listCompilationCounter++;
	}

	listCompilationCounter = 0;	// reset array counter

	while (prosodicTextProcessor.consonants[listCompilationCounter])	// likewise, make a list of valid consonants
	{
		consonantList.concat(prosodicTextProcessor.consonants[punctuationSearchCounter])
		listCompilationCounter++;
	}
	
	listCompilationCounter = 0;	// reset array counter
	charCounter = 0;

	breakingSyllableFlag = 0;
	syllablePart = "";	// store result of graph/punctuation check function
	
	
	// go through this until whole vocalic text ('word') processed - loop as need be for as many syllables as word contains
	while(characterCounter > vocalicText.length) 	// while count not exceeding 'word' length
	{	// while still word to be processed (counter not at end)
		
		if ()
			{// if first letter is a vowel? 
				{// ...if yes, 1st is a vowel, look for however many vowels
					// minus punctuation, store result already in nucleus (V or VC type syllable)
					// also, store whole result (including punctuation) in syllable text
				}
			}	// end of "if 1st letter vowel"
		else	// else, if 1st letter is not a vowel (must be a CV or CVC type syllable), 
			{		//...look for however many consonants
			
			}
			// whichever way - minus punctuation, store result in onset (do this even for V or VC type: so that onset = nucleus)
				// also, store whole result in syllable text
				//*** end of onset process
				//*** start of nucleus (2nd) process
		if() //	if there is still vocalic text left and if syllable-breaking vowel not found in prevous part 
			{
				if() // if first letter of remaining text is a consonant 
				{	
					// then look for however many consonants (must be VC type syllable)
					// minus punctuation, store result already in coda (must be VC type syllable)
					// also, append whole result (including punctuation) in syllable text
					
					//?	need to break to end/beginning of if from here (as must be at end of VC syllable), to process next syllable
				}
				else // else if first letter of remaining text is not a consonant but a vowel (cannot be V, must therefore be CV or CVC type) 
				{
						// then look for however many vowels (CV or CVC)
						// minus punctuation, store result in nucleus (CV or CVC)
						// also, store whole result in syllable text
					
					//*** end of onset process
					//*** start of nucleus (2nd) process
					if ()	// now, if there is still vocalic text left and if syllable-breaking vowel not found in prevous part
					{	// must have been CV or CVC before, so if no text left, would be a CV: by elimination therefore must be CVC
						// so look for however many consonants (must be CVC)
						// minus punctuation, store result in coda (must be CVC)
						// also, append whole result (including punctuation) in syllable text
						// 
					}
					else	// else if at end of CV syllable
					{
						// then, since CV type, set coda = nucleus (?? or leave blank?)
						// and whole syllable text already complete					
						//? need to break from here to end/beginning of if
					}
	
					
				} // end of "else if first letter not a vowel..."
			}	// end of start nucleus stage text "if"
		//if
		
		else
		{
			if (syllable.getCoda().length==0)	// else, if no text left after first syllable part (must have been V - vowel only syllable)
			
			{
				// then, since V type only, set coda = nucleus = onset  (?? or leave blank?)
	
			}	// and whole syllable text already complete
		}


		// reset syllable parts

		syllableArray.push(syllable);
		
		syllable.setText("");
		syllable.setOnset("");
		syllable.setNucleus("");
		syllable.setCoda("");
			
	
	}	// end of while for whole 'word'/vocalic text	
	
	// deal with punctuation - add to syllable text but not to onset, nucleus or coda	
	
	
}	// end of syllabify iterative function
*/

ProsodicTextProcessor.prototype.syllabify = function(vocalicText, prosodicTextProcessor)
{
	// take single vocalic text object (not string) as character or array of vocalic texts ?
	// split into syllables, and each syllable into syllable parts (onset/nucleus/coda)
	// return a string of syllables ?
	
	var syllable = new Syllable("","","","");	// blank new syllable
/*	syllable.setOnset("");
	syllable.setNucleus("");
	syllable.setCoda("");
	syllable.setText("");	*/
	
	var syllableArray = new Array();
	
	var listCompilationCounter = 0;
	
	var nonBreakingPunctuation = "";
	var breakingPunctuation = "";
	var vowelList = "";
	var consonantList = "";

	var characterCounter = 0;	// v important - this counter of position within 'word' / vocalic text should be incremented within the check-for-bi-or-tri-graphs function (to which tis passed as argument)
	
	var punctuationSearchCounter = 0;
	var punctuationList;
	var vowelCounter = 0;		// 1 vowel max per syllable
	var consonantCounter = 0;	// useful for tracking form (V,VC,CV,CVC) of syllable
	
	var syllableElementCounter = 0;

		
	var consonantsRegEx = prosodicTextProcessor.buildGraphsRegularExpression(prosodicTextProcessor.getConsonants(),true,prosodicTextProcessor.getConsonants2Graph(),prosodicTextProcessor.getConsonants3Graph());
	// derive a regular expression of consonants on which to split vocalic text / 'word' (including a double for all consonants - 2nd argument)
	// credit to D Trethewey on https://bitbucket.org/davidtreth/taklow-kernewek & https://taklowkernewek.neocities.org/NLPkernewek.html 

	var vowelsRegEx = prosodicTextProcessor.buildGraphsRegularExpression(prosodicTextProcessor.getVowels(),false,prosodicTextProcessor.getVowels2Graph(),prosodicTextProcessor.getVowels3Graph());

	//var regex = /(spl|skw|sqw|spr|dhr|thr|str|kwr|tth|ggh|ssh|rth|rdh|yon|yow|bl|br|ch|cl|cr|cn|fl|fr|gh|gl|gr|gwr|gw|rd|rt|dh|th|hwr?|nc|nd|nk|ns|pl|pr|qw|rd|kw|kn|ks|sc|st|sp|sk|vl|vr|bb|cc|dd|ff|gg|hh|jj|kk|ll|mm|nn|pp|qq|rr|ss|tt|vv|ww|xx|zz|[bcdfghjklmnpqrstvwxz])/i;

	
	// deal with punctuation - add to syllable text but not to onset, nucleus or coda
	
	var breakingPunctuationSearch = "";
	
	//punctuationList = prosodicTextProcessor.getNonBreakingPunctuation();

	punctuationList = prosodicTextProcessor.getBreakingPunctuation();
	
			// make a list of syllable-breaking punctuation for which to look

	for (listCompilationCounter = 0; listCompilationCounter < punctuationList.length; listCompilationCounter++)
	{
		//breakingPunctuationSearch = breakingPunctuationSearch + String.fromCharCode(92) + punctuationList[listCompilationCounter];
		breakingPunctuationSearch = breakingPunctuationSearch + punctuationList[listCompilationCounter];
	}
	
	var breakingPunctuationRegEx = new RegExp("([" + breakingPunctuationSearch + "])");

	listCompilationCounter = 0;	// reset array counter

	var nonBreakingPunctuationSearch = "";
	
	punctuationList = prosodicTextProcessor.getNonBreakingPunctuation();
	
	//while (punctuationList[listCompilationCounter])	// make a list of non-syllable-breaking punctuation for which to look
	
	for (listCompilationCounter = 0; listCompilationCounter < punctuationList.length; listCompilationCounter++)
	{
		nonBreakingPunctuationSearch = nonBreakingPunctuationSearch + String.fromCharCode(92) + punctuationList[listCompilationCounter];
	}


	var nonBreakingPunctuationRegEx = new RegExp("([" + nonBreakingPunctuationSearch + "])");

	listCompilationCounter = 0;	// reset array counter

	
	var splittingRegEx = RegExp(consonantsRegEx.source.substring(0,consonantsRegEx.source.length-1) + vowelsRegEx.source.substring(1),'i');		// splice consonant and vowel regexes to split the whole thing up
	
	//var splittingRegEx = RegExp(consonantsRegEx.source.substring(0,consonantsRegEx.source.length-1) + vowelsRegEx.source.substring(1,vowelsRegEx.source.length-1) + breakingPunctuationRegEx.source.substring(1) ,'i');		// splice consonant and vowel regexes to split the whole thing up, with punctuation (lose opening parentheses but use closing parenthesis of final regex)
	//
	
	// include punctuation in regex ?	
	
	var splitText = vocalicText.getText().split(splittingRegEx);
	
	// remove any splitted elements which are completely blank (likely at beginning and end) 

	
	for (listCompilationCounter = 0; listCompilationCounter < splitText.length; listCompilationCounter++)	// for every element in split-ted result
	{
		if (splitText[listCompilationCounter] == "")	// if this element blank
		{
			splitText.splice(listCompilationCounter,1);	// then remove this element
		}

	}
	// needs a bit more try{} and catch{}, to be safe


	
	charCounter = 0;

	breakingSyllableFlag = 0;
	syllablePart = "";	// store result of graph/punctuation check function

	vowelCounter = 0;	// keep count of vowels
	

	// loop through all vocalic text elements - should consist of vowels, consonants or punctuation	
	for (syllableElementCounter = 0; syllableElementCounter < splitText.length; syllableElementCounter++)	// for every element of the vocalic text / 'word'
	{

		if(splitText[syllableElementCounter].match(nonBreakingPunctuationRegEx) != null)
		{
			// a symbol which probably belongs in the middle of a syllable (or perched on the end of a syllable, not affecting the syllable boundary) 
			syllable.setText(syllable.getText() + splitText[syllableElementCounter].match(nonBreakingPunctuationRegEx)[0]);	// non-breaking intra-syllable punctuation - add this to the syllable text but not parts, and continue
			splitText[syllableElementCounter] = splitText[syllableElementCounter].replace(nonBreakingPunctuationRegEx,"");	// remove non-breaking from split text (so tis not added to the parts - could interfere with prosody comparisons)
			//syllable.setText(syllable.getText().concat(splitText[syllableElementCounter]));	// see above
		}

		 if (splitText[syllableElementCounter].match(breakingPunctuationRegEx) != null)
		{
			// a symbol which means a break between syllables
			// if this is not the first element of this syllable (unlikely)
			// ... then this symbol belongs to the preceeding syllable/element(??)  
			// else, in case this *is* the first, the punctuation is prepended to the (succeeding) syllable/element(??)) now coming up 

			// must break at previous element (i) add the punctuation to the (ii) send off that syllable (iii) declare new syllable and carry on ?
			// breaking intra-syllable punctuation - add this to the syllable text but not parts			
/*
			 syllable.setText(syllable.getText() + splitText[syllableElementCounter]);
			//syllable.setText(syllable.getText().concat(splitText[syllableElementCounter]));		// set syllable's text likewise			

			prosodicTextProcessor.completeSyllableParts(syllable);	// make sure all syllable parts data (onset, nucleus, coda) are completed
			
			prosodicTextProcessor.syllableCompleted(syllable,syllableArray,vowelCounter,consonantCounter);	// this syllable is complete			
			vowelCounter = 0;		// set vowel counter back to zero
			consonantCounter = 0;	// set consonant counter back to zero
*/
			 if (syllable.getText() != "")		// if syllable-in-the-making is not blank, i.e. if there has already been some text
			 {
				syllable.setText(syllable.getText() + splitText[syllableElementCounter].match(breakingPunctuationRegEx)[0]);	// append breaking character to previous text
			 	prosodicTextProcessor.completeSyllableParts(syllable);	// make sure all syllable parts data (onset, nucleus, coda) are completed
			
			 	prosodicTextProcessor.syllableCompleted(syllable,syllableArray,vowelCounter,consonantCounter);	// this syllable is complete			
			 	vowelCounter = 0;		// set vowel counter back to zero
			 	consonantCounter = 0;	// set consonant counter back to zero

			 	syllable = new Syllable("","","","");	// start afresh with 'new' syllable 
			 	splitText[syllableElementCounter] = splitText[syllableElementCounter].replace(breakingPunctuationRegEx,"");	// remember to strip breaking punctuation from this text, 'going forward' as they say
			 }
		}	// else or just if ??
		 
		 
		 if (splitText[syllableElementCounter].match(vowelsRegEx) != null)		// if there's a vowel within this element
		 //else if (splitText[syllableElementCounter].match(vowelsRegEx) != null)		// if there's a vowel within this element
		{
			vowelCounter++; 	// increment running total of vowels

			// if number of vowels exceeds 2, syllable end has been encountered,...
			// ... so complete that syllable and continue processing this one 
			if(vowelCounter > 1)	// if this is the end of the word, must be the end of the syllable
			{				
				// in case syllable parts (onset, nucleus, coda) not yet all completed, then fill them in, for rhyme checking
				prosodicTextProcessor.completeSyllableParts(syllable);
				prosodicTextProcessor.syllableCompleted(syllable,syllableArray,vowelCounter,consonantCounter);	// this syllable is complete
				vowelCounter = 1;
				//break;
			}
			
			// carrying on, or if still only on 1 vowel so far, ...
			
			if (consonantCounter == 0)		// if no consonants yet . . . 
			{
											// . . . must be syllable of form V or VC
				syllable.setOnset(syllable.getOnset() + splitText[syllableElementCounter].toLowerCase());		// fine to set onset as vowel for V or VC
				syllable.setText(syllable.getText() + splitText[syllableElementCounter]);		// set syllable's text likewise
				syllable.setType("V");		// partially complete syllable type data
				// this syllable may not be complete yet - try to continue
			}
			else				// otherwise if there has been a consonant (presumably 1 only) . . . 
			{
								// . . . must be a syllable of form CV or CVC
				syllable.setNucleus(syllable.getNucleus() + splitText[syllableElementCounter].toLowerCase());		// fine to set nucleus as vowel for V or VC
				syllable.setText(syllable.getText() + splitText[syllableElementCounter]);			// set syllable's text likewise
				syllable.setType("CV");
				// this syllable may not be complete yet - try to continue				
			}
		}
		else if (splitText[syllableElementCounter].match(consonantsRegEx) != null)		// if there's a consonant within this element
		{
			consonantCounter++;
			if (vowelCounter == 0)		// if no vowels yet . . . 
			{
											// . . . must be syllable of form CV or CVC
				syllable.setOnset(syllable.getOnset() + splitText[syllableElementCounter].toLowerCase());		// fine to set onset as vowel for V or VC
				syllable.setText(syllable.getText() + splitText[syllableElementCounter]);		// set syllable's text likewise				
				//syllable.setText(syllable.getText().concat(splitText[syllableElementCounter]));		// set syllable's text likewise
				// this syllable may not (should not) be complete yet (as consonant and no vowel) - hopefully will be CV or CVC - try to continue				
			}
			else				// otherwise if there has been a consonant (presumably 1 only) . . . 
			{
				if (consonantCounter > 1)		//  . . . must be a syllable of form VC or CVC - but which ? (Need to know, to set C in nucleus or coda.) Is there more than 1 consonant ?
				{
												// ... there's a vowel and more than 1 consonant - must be CVC
				syllable.setCoda(syllable.getCoda() + splitText[syllableElementCounter].toLowerCase());		// fine to set coda as vowel for V or VC
				syllable.setText(syllable.getText() + splitText[syllableElementCounter]);		// set syllable's text likewise
				//syllable.setText(syllable.getText().concat(splitText[syllableElementCounter]));		// set syllable's text likewise				
				syllable.setType("CVC");				
				prosodicTextProcessor.syllableCompleted(syllable,syllableArray,vowelCounter,consonantCounter);	// this syllable is complete
				vowelCounter = 0;		// set vowel counter back to zero
				consonantCounter = 0;	// set consonant counter back to zero
				//break;
				}
				else		// otherwise, must be a syllable of VC, if still only 1 consonant with a vowel already in position
				{
					syllable.setCoda(syllable.getCoda() + splitText[syllableElementCounter].toLowerCase());		// fine to set coda as vowel for V or VC
					syllable.setText(syllable.getText() + splitText[syllableElementCounter]);		// set syllable's text likewise
					//syllable.setText(syllable.getText().concat(splitText[syllableElementCounter]));		// set syllable's text likewise					
					syllable.setNucleus(syllable.getOnset());	// for rhyme purposes, for VC syllable, set the nucleus to be the same as the onset
					syllable.setType("VC");
					prosodicTextProcessor.syllableCompleted(syllable,syllableArray,vowelCounter,consonantCounter);	// this syllable is complete
					vowelCounter = 0;		// set vowel counter back to zero
					consonantCounter = 0;	// set consonant counter back to zero
					//break;
				}
			}
			
		}
	
		
		
		// if number of vowels exceeds 2, syllable end has been encountered,...
		// ... so complete that syllable and continue processing this one 
		// 
		
		// if breaking inter-syllable punctuation encountered, this must be the end of the syllable
	}	// end of for-every-element-in-split-text loop - all vocalic text elements processed by here
		
	
	if (syllableElementCounter == splitText.length)		// should be at end by now
	{
		//if (syllableArray.length == 0)		// if syllable array not yet set up
		if (syllable.getText != "")		// if syllable array not yet commited (eg if comma on end)
		{
			prosodicTextProcessor.completeSyllableParts(syllable);
			prosodicTextProcessor.syllableCompleted(syllable,syllableArray,vowelCounter,consonantCounter);	// this syllable is complete			
			vowelCounter = 0;		// set vowel counter back to zero
			consonantCounter = 0;	// set consonant counter back to zero
		}
	}
	
	prosodicTextProcessor.setSyllableStress(syllableArray);		// mark stress on appropriate syllable
	
	return syllableArray;
	
}	// end of syllabify function


ProsodicTextProcessor.prototype.syllableCompleted = function(completedSyllable,presentSyllableArray,vowelCounter,consonantCounter)
{
	var syllableCopy = new Syllable(completedSyllable.getText(),completedSyllable.getOnset(),completedSyllable.getNucleus(),completedSyllable.getCoda());
	syllableCopy.setType(completedSyllable.getType());
	presentSyllableArray.push(syllableCopy);		// push syllable onto array for this vocalic text / 'word'
	
	// reset syllable parts

	completedSyllable.setText("");
	completedSyllable.setOnset("");
	completedSyllable.setNucleus("");
	completedSyllable.setCoda("");
	completedSyllable.setType("");
	
	vowelCounter = 0;		// set vowel counter back to zero
	consonantCounter = 0;	// set consonant counter back to zero
	// oops, argument values not changed within functions (only objects can be changed)
}


ProsodicTextProcessor.prototype.completeSyllableParts = function(partiallyCompleteSyllable)
{
	// in case syllable parts (onset, nucleus, coda) not yet all completed, then fill them in, for rhyme checking
	if (partiallyCompleteSyllable.getType() == "V")				// if a syllable of type V, it will have ...
	{
		partiallyCompleteSyllable.setNucleus(partiallyCompleteSyllable.getOnset());
		partiallyCompleteSyllable.setCoda(partiallyCompleteSyllable.getNucleus());	// ... uncompleted syllable parts data - set both nucleus and coda to contain copy of onset vowel
	}
	else if (partiallyCompleteSyllable.getType() == "CV")				// if of type CV, it will have ...
	{
		partiallyCompleteSyllable.setCoda(partiallyCompleteSyllable.getNucleus());	// ... uncompleted parts data - copy vowel nucleus on to coda also
	}				
		// done fitty
}


ProsodicTextProcessor.prototype.setSyllableStress = function(completedSyllableArray)
{
	// TEMPORARY (bit crude)
	var arrayLength = completedSyllableArray.length;	//
	var stressedIndexValue = Math.max(arrayLength - 2,0);
	
	completedSyllableArray[stressedIndexValue].setStress(true);	// flag penultimate (or first) syllable as bearing the stress
	
	// could call in exception lookup words from ProsodicTextProcessor in here
}

ProsodicTextProcessor.prototype.setVowelLength = function(syllable)
{
	// TODO: depends on position of syllable, nature of consonant(s) in nucleus or coda, ...
}



ProsodicTextProcessor.prototype.soundexesqueAssign = function()
{

// NB setup code	
	
	// declare a soundexesque (or use ProsodicTextProcessor's own?) array (as a lookup / 'hash' table) - this will soon be a generic object due to using text indexes instead of numbers (as a javascript array should.) NB may change if this code ported.
	
	// read in soundexesque string
	// split on (and capture) numeric characters (via reg ex)
	// so split (to array)
	// for every element in the array (i.e. every soundexesque value)
	// split this on array further on commas
	// the first value in this array is the soundesque value
	// for every element after the first (which contain the graphs to be assigned soundexesque values)
	// define a value of the array/object, with the graph as the index and the soundexesque value (first element) as associated value 
	
	// if referring to a ProsodicTextProcessor instance, set that instance's soundexesque array to be thus
	
	// define full or near matches i/y, e/a
	
	// function - assigns Soundex-esque value string of digits to a sound
	// NB - only takes 1 sound at a time - to build a full soundexesque string, make repeated calls
	
	// if a vowel [A-Za-z] 
	// then return lower case of vowel
	// else (must presumably be a consonant) look up the passed consonant argument
	// return its soundexesque value
	
	
	
	// eg An = a5
	// eg Tas = 3a2
	// eg a = a
	// eg Nev = 5e1
	// eg tra = 36a
	// eg dhe'n = 30e5
	
	
	// alliteration - check first digit (actually at stressed syllable ([a-z0-9]) \i - first in English) 
		// initial alliteration () - check first digit of syllable (of word?) (need to identify 1st syllable of word, or pass only this over for checking) 
	// rhyme - check penultimate and final digits	{0,10}(..)
	// consonance - check consonant(s) (numeric) only  () - probably need to distinguish whether leading or trailing consonant (in case of CVC, or CV or VC), - 2 seprate checks - maybe allow different ends of syllable but higher value if same
	// assonance - check vowel sound (alphabetic) only (vowelsRegEx?vowelsRegEx)
	
	// check: method: perhaps best to Soundexesque syllable parts on-the-fly for checks (request onset/nucleus/coda each time as required by type of check)
	
	// check: method: could split on vowels
	
	// check: method: look for vowels using Regular expression, to catch bigraphs
	
	// check: diphthongs / 2graph vowel - eg eu ay - presence of either vowel should suffice in generous check - OR logic
	
	// check: similarities of vowels eg a~e  i=y  
	
	// check: special cases eg plynch - ch more like sh (20) than gh (20) ummm ?
	
	// check: multi-graph consonants - eg gh (20)  - must be exact match ?? or check for match ie 2-graph inside 3graph eg n inside nd, in case of incorrect syllabification (lower score for possible match)   
	
	
	//- NB remove code that infills blank parts of syllable? to avoid duplicate Soundex-esque encoding ?
	
	// get onset
	// for every character,
	// lookup Soundex-esque code
	// append to Soundex-esque value of syllable
	// get nucleus
	// if not same as onset
	// then lookup Soundex-esque code
	// and append to Soundex-esque value of syllable
	// get coda
	// if not same as nucleus
	// then lookup Soundex-esque code
	// and append to Soundex-esque value of syllable
	
	// set Soundexesque value
	
	
	// for hash table, use string index with array syntax, but thence will be just an object, not array instance - array methods therefore unavailable - cf http://www.w3schools.com/js/js_arrays.asp re javascript & string index
	
	// function - Soundex assignment - argument 1 syllable
	// tailored to language
	// including 2-graph-vowels & 2-graph-consonants (?)
	// vowels encoded even if in middle of consonant (CVC)
	// might need to add value for 'near soundex' e.g. OM 39 & OM 40 *yn jy*dh may roll*ons i* i.e. ns ~ nj i.e. soundex 52 ~ 52
	// also near e.g. th/dh ~ s i.e. 0 ~ 2  
	// ie fallback possibilities for half-marks    
	// toLower case comparison
	// may be different phonetics parameters for the same language/orthography (more or less strictly matching)
	// metaphone? 0 = th  0 = dh ?? or 0 for 'h' aspiration
	// b, f, p, v -> 1 k?
	// c, g, j, k, q, s, x, z -> 2
	// d, t -> 3
	// l -> 4
	// m, n -> 5
	// r -> 6			
	// th, dh -> 0?
	// https://en.wikipedia.org/wiki/Soundex

	// NB radicals & mutations often within same category - effect = ???
	
}


// NB need a method in ProsodicTextProcessor.prototype.getAllVowelsRegularExpression() .getAllConsonantsRegularExpression() 
// using  buildGraphsRegularExpression(1,double,2,3)  - 1 set up ready for vowels and 1 set up ready for consonants
// NB must ensure all that onset, nucleus and coda values for vowels are lower case


ProsodicTextProcessor.prototype.soundexesqueComparison = function(soundexesqueA, soundexesqueB)
{
	// compare only 1 soundexesque value at a time
	// multiple comparisons (e.g. rhyme, where nucleus plus coda) must be done by repeated calls
	// if vowel passed in for comparison with consonant, match value will certainly be zero	
	// returns a value between 0 and 1, representing goodness of match

	// if vowels [a-z]
	// if vowels both single graph,
	// and if vowel of syllable A is same as vowel of syllable B ...
	// ... then , full match (=1)
	// (some vowels can be allowed full or near match (e.g. Cornish i and y, or miscellaneous e and a))
	// else, if 1 or both vowels 2-graph
	// if vowel of syllable A is same as vowel of syllable B, full match (=1)
	// else, if not full match, for each character of A 
	// for every character of B
	// compare - if match found...
	// ... then assign 50% match
	
	// else, if consonant
	// if both consonants single graph (i.e. length: 1 soundexesque digit)
	// and if soundexesque value of syllable A is same as vowel of syllable B, full match (=1)
	// else, if 1 or more consonants is multi-graph
	// if soundexesque digit A match soundexesque digits B ...
	// ... then, full match (=1)
	// else, if not full match, (getting complicated)
	// for each soundexesque A digit
	// for each soundexesque B digit
	// compare - if match found...
	// ... then assign 50% match
		
	// (normalised to 1)
	// return value
	
	//TODO: could facilitate comparison of characters with accents, although this really intended for phonetic text
}

ProsodicTextProcessor.prototype.alliterationCheck = function(syllableA, syllableB)
{
	// to compare initial alliteration, pass in first syllable of each
	// to compare stressed alliteration, pass in stressed syllable of each (loop through syllables until stressed == true)
	
	// get soundexesque of syllable A onset		e.g. t of 'Tas', a of 'An', dh of 'dhe'n' 
	// get soundexesque of syllable B onset
	// compare the values
	// return comparison value
}

ProsodicTextProcessor.prototype.consonanceCheck = function(syllableA, syllableB)
{
	// consonance - check consonant(s) (numeric) only  () - probably need to distinguish whether leading or trailing consonant (in case of CVC, or CV or VC), - 2 seprate checks - maybe allow different ends of syllable but higher value if same
	// number of results: CV vs CV/VC = 1, VC vs CVC = 2, CVC vs CVC = 4
	// returns x by 3 array where 1st sub-array contains comparison result, 2nd sub-array contains name of syllable A part, and 3rd sub-array contains name of syllable B part 
	
	// if only wishing to test onset or coda edge of a syllable, may wish to instantiate and pass in otherwise-empty dummy / temporary syllable 
	// NB by default, does not test for consonance within a single syllable - could do (see above)
	
	// for each part of syllable A
	// if that part is a consonant and is not the same as the previous part
	// get soundexesque value of that part's consonant
	// for each part of syllable B
	// if that part is a consonant and is not the same as the previous part
	// get soundexesque value of that part's consonant
	// compare each consonant's soundexesque value with syllable B
	// push comparison value onto array , and ...
	// ... push name of part A into array ("onset"|nucleus|"coda")
	// ... push name of part B into another array ("onset"|nucleus|"coda")
	
	// return array of comparison values and parts
}


ProsodicTextProcessor.prototype.assonanceCheck = function(syllableA, syllableB)
{
	// assonance - check vowel sound (alphabetic) only (vowelsRegEx?vowelsRegEx)
	// VC, CV, CVC, V - all have no more and no less than 1 vowel - 1 result returned
	// returns comparison value of vowels
	
	// check syllable A's onset - if this a vowel, store and move on
	// else check syllable A's nucleus - if this a vowel, obtain  vowel's soundexesque value, store and move on
	// else store syllable A's coda

	// check syllable B's onset - if this a vowel, store and move on
	// else check syllable B's nucleus - if this a vowel, obtain  vowel's soundexesque value, store and move on
	// else store syllable B's coda

	
	// compare soundexesque value of vowels of syllables A and B
	// return result
	
}

ProsodicTextProcessor.prototype.rhymeCheck = function()
{
	// rhyme - check penultimate and final digits
	// the syllable's 'rime' is considered to be the nucleus plus the coda
	// returns 1 result of rhyme comparison between syllables

	// get syllable A's nucleus, obtain its soundexesque value and store
	// get syllable A's coda, obtain its soundexesque value and store
	
	// get syllable A's nucleus, obtain its soundexesque value and store
	// get syllable A's coda, obtain its soundexesque value and store
	
	// compare soundexesque value of nucleus of syllables A and B
	// compare soundexesque value of coda of syllables A and B
	
	// sum both comparisons and halve the total
	// i.e. the rhyme check is an average of the nucleus comparison and the coda comparison - a partial rhyme (e.g. rhyming nuclei but not codas) gives some result value - normalised to 1 for nearlybout perfect rhyme
	// return result
}


function ProsodicHarmonyVector ()
{
		// an instance of prosodic harmony (rhyme, alliteration, consonance, assonance) between 2 syllables
		// vector is magnitude plus direction
		// store here, point A and point B (cartesian, not polar coordinates) - NB the vector could be considered bidirectional
		
}
// to be represented graphically by a link between 2 syllables

/*
 
  		
	// go through this until whole vocalic text ('word') processed - loop as need be for as many syllables as word contains
	while(characterCounter > vocalicText.length) 	// while count not exceeding 'word' length
	{	// while still word to be processed (counter not at end)
		
		if ()
			{// if first letter is a vowel? 
				{// ...if yes, 1st is a vowel, look for however many vowels
					// minus punctuation, store result already in nucleus (V or VC type syllable)
					// also, store whole result (including punctuation) in syllable text
				}
			}	// end of "if 1st letter vowel"
		else	// else, if 1st letter is not a vowel (must be a CV or CVC type syllable), 
			{		//...look for however many consonants
			
			}
			// whichever way - minus punctuation, store result in onset (do this even for V or VC type: so that onset = nucleus)
				// also, store whole result in syllable text
				//*** end of onset process
				//*** start of nucleus (2nd) process
		if() //	if there is still vocalic text left and if syllable-breaking vowel not found in prevous part 
			{
				if() // if first letter of remaining text is a consonant 
				{	
					// then look for however many consonants (must be VC type syllable)
					// minus punctuation, store result already in coda (must be VC type syllable)
					// also, append whole result (including punctuation) in syllable text
					
					//?	need to break to end/beginning of if from here (as must be at end of VC syllable), to process next syllable
				}
				else // else if first letter of remaining text is not a consonant but a vowel (cannot be V, must therefore be CV or CVC type) 
				{
						// then look for however many vowels (CV or CVC)
						// minus punctuation, store result in nucleus (CV or CVC)
						// also, store whole result in syllable text
					
					//*** end of onset process
					//*** start of nucleus (2nd) process
					if ()	// now, if there is still vocalic text left and if syllable-breaking vowel not found in prevous part
					{	// must have been CV or CVC before, so if no text left, would be a CV: by elimination therefore must be CVC
						// so look for however many consonants (must be CVC)
						// minus punctuation, store result in coda (must be CVC)
						// also, append whole result (including punctuation) in syllable text
						// 
					}
					else	// else if at end of CV syllable
					{
						// then, since CV type, set coda = nucleus (?? or leave blank?)
						// and whole syllable text already complete					
						//? need to break from here to end/beginning of if
					}
	
					
				} // end of "else if first letter not a vowel..."
			}	// end of start nucleus stage text "if"
		//if
		
		else
		{
			if (syllable.getCoda().length==0)	// else, if no text left after first syllable part (must have been V - vowel only syllable)
			
			{
				// then, since V type only, set coda = nucleus = onset  (?? or leave blank?)
	
			}	// and whole syllable text already complete
		}



	}	// end of while for whole 'word'/vocalic text	
	

	
	// assign stress for penultimate syllable
	// TODO: (unless exception stress word)
	
	// return array of syllables

 
 */


/*
function checkForBiOrTriGraphs(characterCounter, nonBreakingPunctuation, BreakingPunctuation, permissible2graphs, permissible3graphs, word)
{
	// function - search vocalic text ('word') for bigraphs or trigraphs (could be vowel or consonant search, depending on arguments supplied)
	// characterCounter : counter of where in word to start check 
	// nonBreakingPunctuation, BreakingPunctuation : arrays of punctuation marks, either not breaking or breaking up a syllable
	// permissible2graphs, permissible3graphs : arrays of possible bigraphs and trigraphs
	// word
	// NB no increment of characterCount needed - done within this function: characterCounter maintains and updates the running index of where in the word is being considered
	// returns a 1-3 character graph (excluding punctuation)
	
	// can't return all punctuation from here? a'm a-dro  
	// punctuation counter (default 0) for non-breaking?
	var punctuationOffset = 0;
	var punctuationFlag = 0;	// punctuation false by default	
	//punctuationCheck(characterCounter, nonBreakingPunctuation, BreakingPunctuation, word)
	// because punctuation whether breaking or non-breaking will disrupt mutigraphs, ...
	// ... return punctuation in graph (but ensure that this will be ignored in onset/nucleus/coda assignment in calling function)
	// NB therefore, may return punctuation ! (beware!)
		punctuationFlag = punctuationCheck(characterCounter, nonBreakingPunctuation, BreakingPunctuation, word);
		// also a check for punctuation? - do not return only punctuation (in case of punctuation 1st character)
		// ignore punctuation at start / end 'vas fynna'
		// need to use puntuationOffset and have way of including punc with returned graph
		// strip out punctuation at end	
	
	if (characterCounter < word.length - 1)	// check whether word has room left for bigraph
	{

		
		if (permissible2graphs.indexOf((word.charAt(characterCounter) + word.charAt(characterCounter + 1))) > -1)	// if present character plus next character, in word, are found in list of permissible bigraphs
		{
			if (characterCounter < word.length - 2)	// check whether or not word has room for trigraph 
			{
				if (permissible3graphs.indexOf((word.charAt(characterCounter) + word.charAt(characterCounter + 1) + word.charAt(characterCounter + 2))) > -1)	// now check for whether  present character plus next character plus character after that, in word, are found in list of permissible trigraphs
				{
					var trigraph = charAt(characterCounter) + charAt(characterCounter + 1) + charAt(characterCounter + 2)
					characterCounter++;
					characterCounter++;
					characterCounter++;	// triple increment counter					
					return trigraph;	// return trigraph										
				}
				else 	// if not in list of trigraphs, but a valid bigraph, must be a bigraph
				{
					var bigraph = charAt(characterCounter) + charAt(characterCounter + 1); 
					characterCounter++;
					characterCounter++;	// double increment counter
					return bigraph;	// return bigraph					
				}
			}
			else	// otherwise, if not enough characters left for there to be a trigraph, must be bigraph
			{
				var bigraph = charAt(characterCounter) + charAt(characterCounter + 1);
				characterCounter++;
				characterCounter++;	// double increment counter
				return bigraph;	// return bigraph
			}
		}
		else	// otherwise, if 2 characters not in permissble bigraphs list, just return 1 character
		{
			characterCounter++;
			return charAt(characterCounter);	// return single character as vowel/consonant
		}
	}
	else	// if counter at end of array
	{
		characterCounter++;
		return charAt(characterCounter);		// must be a 1-letter vowel/consonant as part of syllable
	}
	//NB in testing, check that i passed into function is incremented (may need renaming to same variable name as in calling function)
}	// original

*/


function checkForBiOrTriGraphs(characterCounter, nonBreakingPunctuation, BreakingPunctuation, permissible2graphs, permissible3graphs, word)
{
	// function - search vocalic text ('word') for bigraphs or trigraphs (could be vowel or consonant search, depending on arguments supplied)
	// characterCounter : counter of where in word to start check 
	// nonBreakingPunctuation, BreakingPunctuation : arrays of punctuation marks, either not breaking or breaking up a syllable
	// permissible2graphs, permissible3graphs : arrays of possible bigraphs and trigraphs
	// word
	// NB no increment of characterCount needed - done within this function: characterCounter maintains and updates the running index of where in the word is being considered
	// returns a 1-3 character graph (excluding punctuation)
	
	// can't return all punctuation from here? a'm a-dro  
	// punctuation counter (default 0) for non-breaking?
	var punctuationOffset = 0;
	var punctuationFlag = 0;	// punctuation false by default	
	//punctuationCheck(characterCounter, nonBreakingPunctuation, BreakingPunctuation, word)
	// because punctuation whether breaking or non-breaking will disrupt mutigraphs, ...
	// ... return punctuation in graph (but ensure that this will be ignored in onset/nucleus/coda assignment in calling function)
	// NB therefore, may return punctuation ! (beware!)
	
	var wordCopy = word;
	var graph = "";
	// for each element in punctuation

	// including coping with punctuation, both syllable breaking and non-breaking
	
	var punctuationSearch = "[";	// start with regular expression character class bracket
	var punctuationLocation = "";
	var punctuationSearchCounter = 0;
	
	// NB TODO need to pass in & use permissible punctuation (both syllable breaking and syllable non-breaking)

	while (nonBreakingPunctuation[punctuationSearchCounter])	// make a list of non-syllable-breaking punctuation for which to look
	{
		punctuationSearch.concat(String.fromCharCode(92) + nonBreakingPunctuation[punctuationSearchCounter])
		punctuationSearchCounter++;
	}
	punctuationSearchCounter = 0;	// reset array counter
	
	while (breakingPunctuation[punctuationSearchCounter])	// add to list for syllable-breaking punctuation
	{
		punctuationSearch.concat(String.fromCharCode(92) + breakingPunctuation[punctuationSearchCounter])
		punctuationSearchCounter++;		
	}

	punctuationSearch.concat("]");		// add closing regular expression character class bracket 

	
	//punctuationSearch =  "[\'\-]";	// try this string   // \[\'\-]\
	punctuationLocation = wordCopy.search(punctuationSearch);	// search for punctuation (1st - hopefully only - occurrence)	//reg ex
	wordCopy.replace(punctuationSearch,"");	// reg ex
	
	// copy word
	// note location of punctuation
	// remove punctuation from copy
	// perform graph check
	 
	 
	// if length = 0 after removing punctuation, no need for graph check! Just return punctuation!
	
	
//		punctuationFlag = punctuationCheck(characterCounter, nonBreakingPunctuation, BreakingPunctuation, word);
		// also a check for punctuation? - do not return only punctuation (in case of punctuation 1st character)
		// ignore punctuation at start / end 'vas fynna'
		// need to use puntuationOffset and have way of including punc with returned graph
		// strip out punctuation at end	
	
	if (characterCounter < wordCopy.length - 1)	// check whether word has room left for bigraph
	{

		
		if (permissible2graphs.indexOf((wordCopy.charAt(characterCounter) + wordCopy.charAt(characterCounter + 1))) > -1)	// if present character plus next character, in word, are found in list of permissible bigraphs
		{
			if (characterCounter < wordCopy.length - 2)	// check whether or not word has room for trigraph 
			{
				if (permissible3graphs.indexOf((wordCopy.charAt(characterCounter) + wordCopy.charAt(characterCounter + 1) + wordCopy.charAt(characterCounter + 2))) > -1)	// now check for whether  present character plus next character plus character after that, in word, are found in list of permissible trigraphs
				{
					graph = charAt(characterCounter) + charAt(characterCounter + 1) + charAt(characterCounter + 2)
					characterCounter++;
					characterCounter++;
					characterCounter++;	// triple increment counter					
					//return trigraph;	// return trigraph										
				}
				else 	// if not in list of trigraphs, but a valid bigraph, must be a bigraph
				{
					graph = charAt(characterCounter) + charAt(characterCounter + 1); 
					characterCounter++;
					characterCounter++;	// double increment counter
					//return bigraph;	// return bigraph					
				}
			}
			else	// otherwise, if not enough characters left for there to be a trigraph, must be bigraph
			{
				graph = charAt(characterCounter) + charAt(characterCounter + 1);
				characterCounter++;
				characterCounter++;	// double increment counter
				//return bigraph;	// return bigraph
			}
		}
		else	// otherwise, if 2 characters not in permissble bigraphs list, just return 1 character
		{
			characterCounter++;
			graph = charAt(characterCounter);	// return single character as vowel/consonant
		}
	}
	else	// if counter at end of array
	{
		characterCounter++;
		graph = charAt(characterCounter);		// must be a 1-letter vowel/consonant as part of syllable
	}
	//NB in testing, check that i passed into function is incremented (may need renaming to same variable name as in calling function)

		// compare length of graph with location of punctuation
	// if punctuation was at zero, prepend (e.g. 'vas)
	// if punctuation was between 1 and length of graph, insert (e.g. a'y)
	// if punctuation was at length of graph+1, append (e.g. y fynna')   
	
	if (punctuationLocation != -1)
	{
		if (graph.length == 0)
		{	
			graph = word.charAt(punctuationLocation);	// only punctuation, if anything
		}
		else if (punctuationLocation == 0)
		{
			graph = word.charAt(punctuationLocation) + graph;
		}
		else if (punctuationLocation = graph.length)
		{
			graph.concat(word.charAt(punctuationLocation));
		}
		else
		{
			graph = graph.substring(0,punctuationLocation-1) + word.charAt(punctuationLocation) + graph.substring(punctuationLocation);
		}
	}
	
	return graph;
	
}	

/*
function checkForBiOrTriGraphs(characterCounter, nonBreakingPunctuation, BreakingPunctuation, permissible2graphs, permissible3graphs, word)
{
	// function - search vocalic text ('word') for bigraphs or trigraphs (could be vowel or consonant search, depending on arguments supplied)
	// characterCounter : counter of where in word to start check 
	// nonBreakingPunctuation, BreakingPunctuation : arrays of punctuation marks, either not breaking or breaking up a syllable
	// permissible2graphs, permissible3graphs : arrays of possible bigraphs and trigraphs
	// word
	// NB no increment of characterCount needed - done within this function: characterCounter maintains and updates the running index of where in the word is being considered
	// returns a 1-3 character graph (excluding punctuation)
	
	// can't return all punctuation from here? a'm a-dro  
	// punctuation counter (default 0) for non-breaking?
	var punctuationOffset = 0;
	var punctuationFlag = 0;	// punctuation flag - also counter (should not exceed 1) - false/0 by default
	var characterOffsets = new Array();	// default offsets for characters (1/2/3 graph) (the slow way, to be clear)
	characterOffsets[0] = 0;
	characterOffsets[1] = 1;	// offsets start proportional to their index	
	characterOffsets[2] = 2;	
		
	//punctuationCheck(characterCounter, nonBreakingPunctuation, BreakingPunctuation, word)
	// because punctuation whether breaking or non-breaking will disrupt mutigraphs, ...
	// ... return punctuation in graph (but ensure that this will be ignored in onset/nucleus/coda assignment in calling function)
	// NB therefore, may return punctuation ! (beware!) - may return only punctuation
		//punctuationFlag = punctuationCheck(characterCounter, nonBreakingPunctuation, BreakingPunctuation, word);
		// also a check for punctuation? - do not return only punctuation (in case of punctuation 1st character)
		// ignore punctuation at start / end 'vas fynna'
		// need to use puntuationOffset and have way of including punc with returned graph
		// strip out punctuation in calling function	

		if (punctuationFlag ==1)
		{
		// find 
			graph = (characterCounter + punctuationOffset)// add punctuation mark
		}	

		// what if only a remaining single punctuation mark ? eg ' apostrophe	
		
		if(punctuationCheck(characterCounter, nonBreakingPunctuation, BreakingPunctuation, word))	// if punctuation in this very first character
		{
			characterOffsets[0] = 1;
			characterOffsets[1] = 2;	// increase all offsets (1st, 2nd and 3rd)	
			characterOffsets[2] = 3;	

			punctuationOffset = 0;		// record that punctuation is right at the start, before any characters eg. 'vas

			punctuationFlag = 1;	// set flag
		}
		
		
	if (characterCounter + punctuationFlag < word.length - 1)	// check whether word has room left for bigraph
	{
		if(punctuationCheck(characterCounter +1 + punctuationFlag, nonBreakingPunctuation, BreakingPunctuation, word) && punctuationFlag == 0)	// if punctuation in this second character (can't be punctuation in preceding characters, surely)
		{
			characterOffsets[0] = 0;
			characterOffsets[1] = 2;	// increase second & third offsets	
			characterOffsets[2] = 3;	

			punctuationOffset = 1;	// punctuation is second character in e.g. *y'm a'y

			punctuationFlag = 1;	// set flag
		}

		
		if ((characterCounter + punctuationFlag < word.length - 1) && (permissible2graphs.indexOf((word.charAt(characterCounter + characterOffsets[0]) + word.charAt(characterCounter + characterOffsets[1]))) > -1))	// (check for length again - possibility of punctuation at end) if present character plus next character, in word, are found in list of permissible bigraphs
		{
			if (characterCounter + punctuationFlag < word.length - 2)	// check whether or not word has room for trigraph 
			{

				if(punctuationCheck(characterCounter +2 + punctuationFlag, nonBreakingPunctuation, BreakingPunctuation, word) && punctuationFlag == 0)	// if punctuation in this third character (can't be punctuation in preceding characters, surely)
				{	// punctuation in third character
					characterOffsets[0] = 0;
					characterOffsets[1] = 1;	// increase third offset only	
					characterOffsets[2] = 3;	

					punctuationOffset = 2;		// punctuation is 3 characters in e.g. ha'm 

					punctuationFlag = 1;	// set flag
				}

				if ((characterCounter + punctuationFlag < word.length - 2) &&(permissible3graphs.indexOf((word.charAt(characterCounter + characterOffsets[0]) + word.charAt(characterCounter + characterOffsets[1]) + word.charAt(characterCounter + characterOffsets[2]))) > -1))	// (check for length again) now check for whether  present character plus next character plus character after that, in word, are found in list of permissible trigraphs
				{	
					var trigraph = charAt(characterCounter + characterOffsets[0]) + charAt(characterCounter + characterOffsets[1]) + charAt(characterCounter + characterOffsets[2])
					characterCounter++;
					characterCounter++;
					characterCounter++;	// triple increment counter					
					return trigraph;	// return trigraph										
				}
				else 	// if not in list of trigraphs (or bigraph with trailing punctuation), but a valid bigraph, must be a bigraph 
				{
					var bigraph = charAt(characterCounter + characterOffsets[0]) + charAt(characterCounter + characterOffsets[1]); 
					characterCounter++;
					characterCounter++;	// double increment counter
					return bigraph;	// return bigraph					
				}
			}
			else	// otherwise, if not enough characters left for there to be a trigraph, must be bigraph
			{
				var bigraph = charAt(characterCounter + characterOffsets[0]) + charAt(characterCounter + characterOffsets[1]);
				characterCounter++;
				characterCounter++;	// double increment counter
				return bigraph;	// return bigraph
			}
		}
		else	// otherwise, if 2 characters not in permissble bigraphs list, just return 1 character
		{
			characterCounter++;
			graph = charAt(characterCounter + characterOffsets[0]);
			return graph;	// return single character as vowel/consonant
		}
	}
	else	// if counter at end of array
	{
		characterCounter++;
		
		graph = charAt(characterCounter + characterOffsets[0]);
		return graph;		// must be a 1-letter vowel/consonant as part of syllable
	}
	//NB in testing, check that i passed into function is incremented (may need renaming to same variable name as in calling function)
}
// wouldn't work?
*/



function punctuationCheck(characterCounter, nonBreakingPunctuation, BreakingPunctuation, word)
{

	var permissibleCharacters;

	return (nonBreakingPunctuation.indexOf(word.charAt(punctuationCharacterCounter)) != -1) ||(BreakingPunctuation.indexOf(word.charAt(punctuationCharacterCounter)) != -1);
		// if (breaking punctuation does not *not* contain character in question) or if (breaking punctuation does not *not* contain character in question)
		// i.e. is character in question in permitted punctuation list
		
	// NB TODO: need permissible characters variable to allow for characters with accents later
}

//need a neat way(function?) for passing through punctuation
// which handles both syllable non-breaking (a'm) and syllable breaking (a-dro) punctuation


// 'non-breaking' eliding intra-syllable characters
// eg apostrophe e.g. a'y
// 'breaking' inter-syllable characters
// eg dash a-dro yn-bann
// 27/11/15 still feeling lousy with this virus or whatever tis, hopefully recovering
