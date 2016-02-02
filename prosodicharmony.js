//TODO: implement some design patterns here, starting with proper private & public functions - https://addyosmani.com/resources/essentialjsdesignpatterns/book/  

function PhoneticTextDocument(textStream)
{
	this.text = textStream;
}

PhoneticTextDocument.prototype.getText = function ()
{
	return this.text;
}

PhoneticTextDocument.prototype.setText = function (text)
{
	this.text = text;
}

function TraditionalTextDocument(textStream)
{
	this.text = textStream;
}

function ProsodicTextProcessor()
{
	// may not have any properties
/*
	this.vowels = Vowels;
	this.consonants = Consonants;		// PRESENTLY: read from global variables
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
*/	
	
	this.syllableSplittingRegularExpression = "";
	
	this.soundexesqueTable = new Array();	// to be over-ridden as object for use as associative array/hash-table, of Soundex-like values for consonants
	//this.soundexesqueTable = new Array();	// Soundex-like values in array (will be associative array / hash-table)
	
	this.lineSearchRange = 1;				// range within which to perform prosodic search from this line down to adjacent line(s) - default is 1 line 
	/*
	this.allVowelsRegularExpression = this.setAllVowelsRegularExpression();		// construct & cache regular expression, ready for use (to save re-compilation) 
	this.allConsonantsRegularExpression = this.setAllConsonantsRegularExpression();
	*/
	
}

ProsodicTextProcessor.prototype.initialiseRegularExpressions = function()				// initialise function, in case of full or only partial re-initialiasation (e.g. to different orthography, same text)
{
	this.allVowelsRegularExpression = this.setAllVowelsRegularExpression();		// construct & cache regular expression, ready for use (to save re-compilation) 
	this.allConsonantsRegularExpression = this.setAllConsonantsRegularExpression();		
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

	
	while (graph2Array[regCounter])	// take basic 1-graph character list - loop through & make character class / character set within brackets
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


ProsodicTextProcessor.prototype.getAllVowelsRegularExpression = function()
{
	return this.allVowelsRegularExpression;

	// returns a regular expression to find all vowels, as defined by settings set into ProsodicTextProcessor	

}

ProsodicTextProcessor.prototype.setAllVowelsRegularExpression = function()
{
	return this.buildGraphsRegularExpression(this.vowels,false,this.vowels2graph,this.vowels3graph);

	// builds a regular expression to find all vowels, as defined by settings set into ProsodicTextProcessor	
}

ProsodicTextProcessor.prototype.getAllConsonantsRegularExpression = function()
{
	return this.allConsonantsRegularExpression;

	// returns a regular expression to find all consonants, as defined by settings set into ProsodicTextProcessor 

}

ProsodicTextProcessor.prototype.setAllConsonantsRegularExpression = function()
{
	return this.buildGraphsRegularExpression(this.consonants,false,this.consonants2graph,this.consonants3graph);

	// builds a regular expression to find all consonants, as defined by settings set into ProsodicTextProcessor 

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
		if (splitText[i].charAt(0).match(/\b([a-zA-Z\'\-]{1,10})/) && splitText[i].length > 0)	
		{
			for (j = i;j > -1; j--)	// look for \# comment character, (backwards from current 'word') in every previous 'word' of line 
			{
				if (splitText[j].indexOf('#') != -1)	// if /# (comment character) found in any previous 'word' of line 	
				{
					// must be a comment - do no assign this as non-vocalic 'word' - leave to be assigned as non-vocalic 'word'
					// next element in line (which must be also a comment, of course, and therefore will be assigned non-vocalic type likewise: deja vu)
					// redundancy in the search here - TODO should implement flag or other means to either skip this check, or mandate this clause once comment /# character found 
					var nonVocalicText = new NonVocalicText(splitText[i]);	// a comment, or line number, or similar
					nonVocalicText.setBoolComment(true);
					lineText.push(nonVocalicText);
					// NB if there are 2 (or more than 1) comment symbols '#' on a line, this section can cause comment text to be duplicated in the browser's text pane 
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


ProsodicTextProcessor.prototype.getLineSearchRange = function ()
{
	return this.lineSearchRange;
}

ProsodicTextProcessor.prototype.setLineSearchRange = function (lineSearchRange)		// in case user wants to search more than 1 line down from line-of-interest
{
	this.lineSearchRange = lineSearchRange;
}


ProsodicTextProcessor.prototype.setVowels = function(vowels)
{
	this.vowels = vowels;
	return this.vowels;
}
ProsodicTextProcessor.prototype.setConsonants = function(consonants)		// PRESENTLY: read from global variables
{
	this.consonants = consonants;
	return this.consonants;
}
ProsodicTextProcessor.prototype.setVowels2graph = function(vowels2Graph)	// TODO: import all these from CSV
{
	this.vowels2graph = vowels2Graph;
	return this.vowels2graph;
}
ProsodicTextProcessor.prototype.setVowels3graph = function(vowels3Graph)	// not really ?!
{
	this.vowels3graph = vowels3Graph;
	return this.vowels3graph;
}
ProsodicTextProcessor.prototype.setDoubleConsonants = function(doubleConsonants)
{
	this.doubleConsonants = doubleConsonants;
	return this.doubleConsonants;
}
ProsodicTextProcessor.prototype.setConsonants2graph = function(consonants2Graph)
{
	this.consonants2graph = consonants2Graph;
	return this.consonants2graph;
}
ProsodicTextProcessor.prototype.setConsonants3graph = function(consonants3Graph)
{
	this.consonants3graph = consonants3Graph;
	return this.consonants3graph;
}
ProsodicTextProcessor.prototype.setBreakingPunctuation = function(breakingPunctuation)			// inter-syllable breaking punctuation
{
	this.breakingPunctuation = breakingPunctuation;
	return this.breakingPunctuation;
}
ProsodicTextProcessor.prototype.setNonBreakingPunctuation = function(nonBreakingPunctuation)	// intra-syllable non-breaking punctuation
{
	this.nonBreakingPunctuation = nonBreakingPunctuation;
	return this.nonBreakingPunctuation;
}
ProsodicTextProcessor.prototype.setSoundexesque = function(soundexesque)	// soundexesque array
{
	this.soundexesque = soundexesque;
	return this.soundexesque;
}

ProsodicTextProcessor.prototype.getVowels = function()
{
	return this.vowels;
}
ProsodicTextProcessor.prototype.getConsonants = function()		// PRESENTLY: read from global variables
{
	return this.consonants;
}
ProsodicTextProcessor.prototype.getVowels2graph = function()	// TODO: import all these from CSV
{
	return this.vowels2Graph;
}
ProsodicTextProcessor.prototype.getVowels3graph = function()	// not really ?!
{
	return this.vowels3Graph;
}
ProsodicTextProcessor.prototype.getDoubleConsonants = function()
{
	return this.doubleConsonants;
}
ProsodicTextProcessor.prototype.getConsonants2graph = function()
{
	return this.consonants2Graph;
}
ProsodicTextProcessor.prototype.getConsonants3graph = function()
{
	return this.consonants3Graph;
}
ProsodicTextProcessor.prototype.getBreakingPunctuation = function()			// inter-syllable breaking punctuation
{
	return this.breakingPunctuation;
}
ProsodicTextProcessor.prototype.getNonBreakingPunctuation = function()	// intra-syllable non-breaking punctuation
{
	return this.nonBreakingPunctuation;
}
ProsodicTextProcessor.prototype.getSoundexesque = function()	// get soundexesque array
{
	return this.soundexesque;
}


//ProsodicTextProcessor.prototype.setconsonants2graph.concat(ProsodicTextProcessor.prototype.setdoubleConsonants);	// for the moment, add geminates to bigraph consonants

//ProsodicTextProcessor.prototype.setSyllableSplittingRegularExpression = "";

//global variables for the moment - TODO: CSV import


ProsodicTextProcessor.prototype.buildSyllablesInProsodicLinesUsingDisplayText = function(displayTextDoc,prosodicTextDoc)
{

	// function - using a DisplayText object populated with Vocalic (and NonVocalic, here unused) objects, calculate the syllables in the text and populate a ProsodicTextDocument  
	//displayTextDoc - a populated DisplayText object from which to obtain data ,prosodicTextDoc - an unpopulated ProsodicTextDocument object which to populate
	
	var strText = "";
	var blankCount = 0;
	var syllableCount = 0;
	var prosodicLineNumber = 0;

		// function - NB uses shed load of global variables here
			
	// for each line, print each element: get text if non-vocalic, run through syllables if vocalic
		
		// using the split(displayText), add syllables to the prosodicLine 
		// this started as a test routine
	for (lineNumber=0; lineNumber<displayTextDoc.getNumberOfLines(); lineNumber++)		// for every line in DisplayText
	{
		syllableCount = 0;		// reset syllable count at each line
		var prosodicTextLine = new ProsodicTextLine(); 

	for (textNumber=0;textNumber < displayTextDoc.getLineByNumber(lineNumber).getDisplayText().length; textNumber++)		 	
	 	{

 	 	if (displayTextDoc.getLineByNumber(lineNumber).getDisplayText()[textNumber].constructor.name == "NonVocalicText")		 	 	
	 	 	{

 	 	 	strText = strText + displayTextDoc.getLineByNumber(lineNumber).getDisplayText()[textNumber].getText();	 	 	 	 
	 	 	}

 	 	else if (displayTextDoc.getLineByNumber(lineNumber).getDisplayText()[textNumber].constructor.name == "VocalicText")
	 	 	{	

	 	 	for (syllableNumber=0;syllableNumber < displayTextDoc.getLineByNumber(lineNumber).getDisplayText()[textNumber].getSyllables().length; syllableNumber++)			 	 	
		 	 	{

		 	 	if (displayTextDoc.getLineByNumber(lineNumber).getDisplayText()[textNumber].getSyllables()[syllableNumber].getText() =="")				 	 	
			 	 	{
				 	 	blankCount++;
			 	 	}
			 	 	else
			 	 	{
						

			 	 		strText = strText + '|' + displayTextDoc.getLineByNumber(lineNumber).getDisplayText()[textNumber].getSyllables()[syllableNumber].getText() + syllableCount + ':' + lineNumber +  '|';	// diagnostic - compile array of split text, to display syllables			 	 		

			 	 		displayTextDoc.getLineByNumber(lineNumber).getDisplayText()[textNumber].getSyllables()[syllableNumber].setSyllableNumber(syllableCount);	// set the syllable's record of its own number within line (via displayText...!)			 	 		

			 	 		displayTextDoc.getLineByNumber(lineNumber).getDisplayText()[textNumber].getSyllables()[syllableNumber].setProsodicLineNumber(prosodicLineNumber);	// set the syllable's record of line number within prosodic text at which it's found (via displayText...!)			 	 		

			 	 		prosodicTextLine.pushSyllable(displayTextDoc.getLineByNumber(lineNumber).getDisplayText()[textNumber].getSyllables()[syllableNumber]);	// add syllable to the prosodicTextLine			 	 		
			 	 		syllableCount++;		// increment count of syllables
			 	 		
			 	 	}
		 	 	}
	 	 	}
	 	}	// for every text item
	 	strText = strText + '\n';	// hmmm
		if (syllableCount > 0)	// if any syllable have been available to add to a line, this was a genuine prosodic line - so add the line to prosodic text
		{
			prosodicTextLine.setLineNumberWithinTotal(prosodicLineNumber);	// line number within all prosodic-content lines
			displayTextDoc.getLineByNumber(lineNumber).setProsodicLineNumber(prosodicLineNumber);		// record the number of the prosodicTextLine within displayLine, so that user actions are enabled to query prosodic properties of that line (e.g. scrolling up & down)
			displayTextDoc.getLineByNumber(lineNumber).setLineNumberWithinTotal(lineNumber);			// record this display line's number, just in case
			prosodicTextDoc.pushLine(prosodicTextLine);															// push the line into the prosodic Text Document's array of lines
			prosodicTextLine.setProsodicTextDocument(prosodicTextDoc);		// set this Prosodic Text Line's record to show that it is owned by (within) this Prosodic Text Document
			prosodicLineNumber++;
		}
	}	// end of for every line loop

}	// end of buildSyllablesInProsodicLinesUsingDisplayText function

DisplayText.prototype.generateDisplayTextGraphicsFromDisplayTextAndProsodicText = function(prosodicTextDoc)
{	
	// function - generates Raphael graphics from text, to represent both vocalic (syllabic prosody) text and non-vocalic (spaces, punctuation, comments, line numbers) text (NB not including prosodic vectors' graphics - that comes later)
	// NB - uses shed load of global variables here
	
	//paper = raphaelInstance;	// use argument of Raphael object

	var strText = "";

	var textGraphicsCount = 0;
	var paragraphArray = [];	// array for compiling each paragraph's contents
	var paragraphDocumentFragment = document.createDocumentFragment();	 	// https://davidwalsh.name/documentfragment
	var lineCount = 0;
	var paragraphs = [];		// array of HTML paragraph objects, to be created within document's DOM
	var boolNewLine = true;
	
	var syllableMatrix = new Array();
	var syllableGraphicsMatrix = new Array();	// array/matrix for storing syllable text graphic objects
	var textGraphicsArray = new Array();		// array/matrix for storing both non-vocalic and vocalic/syllabic text graphic objects
	
	
	
	for (lineNumber=0; lineNumber<this.getNumberOfLines(); lineNumber++)		// for every line in display text
	{
		syllableCount = 0;		// reset syllable count at each line
		var prosodicTextLine = new ProsodicTextLine();
		boolNewLine = true;	// reset counter of non-white space elements in line, at each line's start
		
		paragraphArray = [];	// reset paragraph content array
		
		paragraphs[lineNumber] = document.createElement("P");	// create a new paragraph for this line
		paragraphs[lineNumber].setAttribute('id','paragraph' + (lineNumber));	// set id of paragraph, according to order - the id number should equal the displayText line number 
		paragraphs[lineNumber].style.position = 'absolute';
		paragraphs[lineNumber].style.fontSize = this.getFontSize();

		paragraphs[lineNumber].style.top = this.getLineY();	// set vertical position according to global variable
		paragraphs[lineNumber].className = "displaytext";

		var strStatistics = "";
		
		var statistics = this.getLineByNumber(lineNumber).getProsodicLineProsodicStatistics(prosodicTextDoc);
		if (statistics != null)
		{ 		
			strStatistics = this.getLineByNumber(lineNumber).buildStatisticsString(statistics);		// get the string reporting statistics for this display text line
		}

		
	 	for (textNumber=0;textNumber < this.getLineByNumber(lineNumber).getDisplayText().length; textNumber++)	// for every non-vocalic or vocalic text element in this display line
	 	{
	 			// for Internet Explorer, the line below may require the constructor.name of objects to be explicitly defined  http://stackoverflow.com/questions/25140723/constructor-name-is-undefined-in-internet-explorer
		 	 	if (this.getLineByNumber(lineNumber).getDisplayText()[textNumber].constructor.name == "NonVocalicText") //&& (displayText.getLineByNumber(lineNumber)[textNumber].getText().match(/[\S\n]/) != null)) // (look for any non-white space character) if no text other than spaces , don't render this as graphic (because Raphael will return a white space's BBox bounding box as all zero (causing constant left-align of all text objects!) - rely instead on x-spacing variable			 	 	
				// TODO: allow white spaces as textNodes
			 	 	{	 	 							 	 		
		 	 	 	strText = this.getLineByNumber(lineNumber).getDisplayText()[textNumber].getText();		 	 	 	
					strText.replace(/s/g, '&nbsp;');	// replace space with HTML non-breaking space 
					strText.replace(/t/g, '&nbsp;');	// replace tab with HTML non-breaking space
			 		textGraphicsArray[textGraphicsCount++] = this.assignTextNode(this.getLineByNumber(lineNumber).getDisplayText()[textNumber]);	// create and assign a textNode within HTML document DOM to this non-vocalic text
					paragraphs[lineNumber].appendChild(textGraphicsArray[textGraphicsCount - 1]);	// add this text node to the current line's paragraph
		 	 	 	 boolNewLine = false;		// at least 1 syllable rendered, so until the next line, this is not a new line
		 	 	 	 
		 	 	}
				else if (this.getLineByNumber(lineNumber).getDisplayText()[textNumber].constructor.name == "VocalicText")
		 	 	{	
			 	 	for (syllableNumber=0;syllableNumber < this.getLineByNumber(lineNumber).getDisplayText()[textNumber].getSyllables().length; syllableNumber++)		// for each syllable in this vocalic text item ('word')
			 	 	{		// for each syllable
				 	 	strText = prosodicTextDoc.getProsodicLineByNumber(lineCount).getSyllables()[syllableCount++].getText();	//syllableCount
	
				 	 	// in case of intra-word (multi-syllabic word), need to group syllables together
				 	 	textGraphicsArray[textGraphicsCount++] = this.assignTextNode(prosodicTextDoc.getProsodicLineByNumber(lineCount).getSyllables()[syllableCount - 1]);				// create and assign a text node in the DOM for this syllable
				 	 	paragraphs[lineNumber].appendChild(textGraphicsArray[textGraphicsCount - 1]);	// add this text node to the current line's paragraph
				 	 	prosodicTextDoc.getProsodicLineByNumber(lineCount).getSyllables()[syllableCount - 1].setTextNode(textGraphicsArray[textGraphicsCount - 1]);	// assign textNode as syllable's textnode (and cache textNode's bounding rectangle, for performance)

				 	 	syllableGraphicsMatrix[lineCount,syllableCount - 1] = textGraphicsArray[textGraphicsCount - 1];
				 	 	prosodicTextDoc.getProsodicLineByNumber(lineCount).getSyllables()[syllableCount-1].setSyllableGraphic(textGraphicsArray[textGraphicsCount - 1]);	// set reference to graphic in Syllable object 				 	 	
	
			 	 		if (syllableCount == prosodicTextDoc.getProsodicLineByNumber(lineCount).getSyllables().length)	// after getting syllable(s), check for end of prosodic text line (tho' may be non-vocalic text yet to come on this display line, of course) 
				 		{
				 			lineCount++;	// increment line count - but only if all syllables on this line have been read !
				 			syllableCount = 0;
				 		}
	
			 	 		boolNewLine = false;		// at least 1 syllable rendered, so until the next line, this is not a new line		 	 				 	 				 	 		
			 	 	}	// end of 'for every syllable' loop		 	 			 		 	 	
		 	 	}	// end of 'if vocalic text' clause	
		
		 	//lineNumber is incremented
		}	// end of 'for every non-vocalic or vocalic text element in this display line' loop
		
//for (var i=0; i < paragraphArray.length; i++)			// for all NonVocalic or Syllable textNodes stored
//{
//	paragraphs[lineNumber].appendChild(paragraphArray[i]);		// append NonVocalic or Syllable textNode to paragraph
//}

////		textPane.appendChild(paragraphs[lineNumber]);		// append line's paragraph to the text pane DIV

		attachLineStatistics(paragraphs[lineNumber],strStatistics);		// call closure function to attach specific statistics in event to this line/paragraph <p>

		paragraphDocumentFragment.appendChild(paragraphs[lineNumber]);		// for now, to avoid triggering document reflow, append paragraph <p> / line in DOM document fragment
		//lineY += this.getVerticalSpace();				// increase vertical offset for next paragraph
		this.setLineY(this.getLineY() + this.getVerticalSpace());				// increase vertical offset for next paragraph
		
	}	// end of 'for every line in display text' loop

	this.getTextPane().appendChild(paragraphDocumentFragment);	//  now that all lines / <p> paragraphs been calculated, append the DocumentFragment (used to avoid triggering document reflow) to the text pane DIV within the document - https://davidwalsh.name/documentfragment 
	
	// now that all lines / <p> paragraphs have been appended, hopefully loop through every line and loop through all Syllables and establish / cache the coordinates of each Syllable's textNode's bounding rectangle  

	for (lineCount = 0; lineCount < prosodicTextDoc.getLines().length; lineCount++)		// for every prosodic line (line containing syllables)
	{
		for (syllableCount = 0; syllableCount < prosodicTextDoc.getProsodicLineByNumber(lineCount).getSyllables().length; syllableCount++)
		{
			prosodicTextDoc.getProsodicLineByNumber(lineCount).getSyllables()[syllableCount].setTextNodeBoundingRect(this.getTextNodeBoundingClientRect(prosodicTextDoc.getProsodicLineByNumber(lineCount).getSyllables()[syllableCount].getTextNode(), document.createRange()));
			// find & set the bounding rectangle for this Syllable's TextNode			
		}
	}

	// closure function for statistics relevant to each individual line/paragraph
	// https://developers.google.com/maps/documentation/javascript/examples/event-closure
	// attachLineStatistics - closure function for statistics to lines
	function attachLineStatistics(paragraphLine,strStats){
		var statsString = new String(strStats);				// declare a new String object with content of the statistics string (passed in) for a particular line 
		paragraphLine.addEventListener('click',function(){alert(statsString)});		// add to the particular line an event listener, using that new String object (see above)
	}		// end of closure-function WITHIN generateDisplayTextGraphicsFromDisplayTextAndProsodicText function

	
}	// end of generateDisplayTextGraphicsFromDisplayTextAndProsodicText function



DisplayText.prototype.assignTextNode = function (splitText)
{
	// creates and populates a textNode within current HTML document DOM
	// splitText - a string of text already split up, either as a Syllable object or as NonVocalicText
	// NB - may return a TextNode, or (if a stressed syllable, or a comment, e.g.) may return a HTML element of type <b>, <i>, for example (bold, italic) - these hopefully will be equally accessible to code and equally ok within a paragraph DOM object
	
	var textNode;
	// for Internet Explorer, this may require constructor.name to be defined explicitly  http://stackoverflow.com/questions/25140723/constructor-name-is-undefined-in-internet-explorer
		if (splitText.constructor.name == 'Syllable')	// this is not exactly how it d'work, but near nuff for a test, hopefully. acc to sylsvg 379, syllables of vocalic text are looped through
		{
			if (splitText.getStress() == true)		//
			{
				textNode = document.createElement("b");
				//textNode.innerHTML = splitText.getText().replace(/\s/g, '&nbsp;').replace(/\t/g, '&nbsp;');
				textNode.innerHTML = splitText.getText();
			}
			else
			//textNode = document.createTextNode(splitText.getText().replace(/\s/g, '&nbsp;').replace(/\t/g, '&nbsp;'));	
				textNode = document.createTextNode(splitText.getText());
		}
		else if (splitText.constructor.name == 'NonVocalicText')	// otherwise, assuming tis NonVocalicText ought to check for whether tis text following a comment
		{
			if (splitText.getBoolComment() == true)		//
			{
				textNode = document.createElement("i");
				//textNode.innerHTML = splitText.getText().replace(/\s/g, '&nbsp;').replace(/\t/g, '&nbsp;');
				textNode.innerHTML = splitText.getText();
			}
			else

			//textNode = document.createTextNode(splitText.getText().replace(/\s/g, '&nbsp;').replace(/\t/g, '&nbsp;'));	
				textNode = document.createTextNode(splitText.getText());
		}		

	return textNode;

}	// end of assignTextNode function


DisplayText.prototype.showSelectedParagraphProsodicVectorsUsingGraphicsStack = function(paragraphidValue,prosodicTextDoc)
{

	// paragraphidValue - id value in <p> which should correspond to the index of the DisplayText Lines 
	
		var vectors = [];	// for assembling & attaching Document Fragment ?
		var polylinesDocumentFragment = document.createDocumentFragment();

var tempcounterAdded =0;
var tempcounterReused =0;
var tempcounterMoved = 0;

		var displayTextLine = this.getLineByNumber(paragraphidValue);	// get the DisplayTextLine number of this paragraph (obtained from <p> element's id) (and thereby get also the DisplayTextLine object)


		if (displayTextLine.getProsodicLineNumber() != null)		// if this DisplayTextLine has a ProsodicLineNumber associated (DisplayTextLines with NonVocalicText only will have no corresponding ProsodicTextLine and will not have had their ProsodicTextLineNumber reset from null)
		{
		 	var prosodicTextLine = prosodicTextDoc.getProsodicLineByNumber(displayTextLine.getProsodicLineNumber());	// get the ProsodicTextLine number for this DisplayTextLine (and thereby get also the ProsodicTextLine object)
			for (var i = 0; i < prosodicTextLine.getSyllables().length ; i++)				// for every Syllable member of this ProsodicTextLine (NB each of which is a syllable, it being a ProsodicTextLine object)
			{
				for (var j = 0; j < prosodicTextLine.getSyllableByNumber(i).getProsodicVectors().length; j++)		// get all of the prosodic Vectors associated with this Syllable, read to loop through them					
				{

					if (! prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).getDrawn())			// check to see whether vector presently/aready drawn - if not,
					{

						if (document.getElementById(prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).getLinkType()).checked && prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).getValue() >= Number($("input[name='limit']:checked").val()))		// refer to id of link type for check box && use jQuery for name of radio button group for prosody vector/link threshold values (0,0.25,0.5,1)
						// NB 22/1/16 - only add vectors as SVG polylines if the appropriate controls are set by user
						{

							if (this.getProsodicVectorGraphicsStack().length > 0)		// if prosodic vector graphic stack not empty
								{
tempcounterReused++;									
									prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).setGraphics(this.reUseProsodicHarmonyLinkWithLeaderLinesGraphic(this.getProsodicVectorGraphicsStack().pop(), prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j)));
								}	// end of if-prosodic-vector-graphic-stack not empty
								else	// else if prosodic vector stack empty (must create a new SVG polyline element (sigh))
								{
									vectors[vectors.length] = prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).setGraphics(this.drawProsodicHarmonyLinkWithLeaderLines(this.getSvg(), prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j)));		// draw a link between syllables to represent this prosodic harmony vector // create the graphic for this vector	// and add the graphic to the DOM
tempcounterAdded++;
								}
						} // [end of if type selected & value selected by user]	
					}	// end of if-vector-not-already-drawn if
					
					else	// else if PRESENTLY DRAWN vector is NOT of type selected by user, hide un & register as available on stack
					{
						if (! (document.getElementById(prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).getLinkType()).checked && prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).getValue() >= Number($("input[name='limit']:checked").val())))	// if vector is NOT of type selected by user's controls' settings
						{
							if (prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).getGraphics() != null)
							{
tempcounterMoved++;
								this.offerPolyLineToGraphicsStack(prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).getGraphics());
								prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).setGraphics(null);			// set graphics for this link to null (for both ends of link) (NB this was a big bug until 29/1/16)
								prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).setDrawn(false);			// clear flag which said that this link is presently represented by a drawn graphic 
							}	// end of if-prosodic-vector's-graphics-not-null
						}	// end of if-user-control-settings-ok if						
					}	// end of else-if-drawn-vector-not-of-type-selected				 	
					
				}	// end of for every prosodic vector in syllable
////			svg.appendChild(polylinesDocumentFragment);		// append DocumentFragment of all polylines to SVG element (global), all at once (instead of repeatedly as individual DOM elements)
			
		}	// end of for every syllable in prosodic line
		console.log('lines added: ' + tempcounterAdded + ' lines reused: ' + tempcounterReused +  ' lines moved to stack: ' + tempcounterMoved);
		}	// end of if-displaytextLine-has-prosodicLineNumber
	
		 
}	// end of showParagraphProsodicVectorsUsingGraphicsStack


DisplayText.prototype.moveParagraphProsodicVectorGraphicsToGraphicsStack = function(paragraphidValue, prosodicTextDoc)
{
	// as paragraph is scrolled off screen record all of its prosodic vector graphics as on a stack, so as to re-use <polyline> graphics (to minimise number of SVG polylines in document, for performance)

		var displayTextLine = displayText.getLineByNumber(paragraphidValue);	// get the DisplayTextLine number of this paragraph (obtained from <p> element's id) (and thereby get also the DisplayTextLine object)
		if (displayTextLine.getProsodicLineNumber() != null)		// if this DisplayTextLine has a ProsodicLineNumber associated (DisplayTextLines with NonVocalicText only will have no corresponding ProsodicTextLine and will not have had their ProsodicTextLineNumber reset from null)
		{
		 	var prosodicTextLine = prosodicTextDoc.getProsodicLineByNumber(displayTextLine.getProsodicLineNumber());	// get the ProsodicTextLine number for this DisplayTextLine (and thereby get also the ProsodicTextLine object)
			for (var i = 0; i < prosodicTextLine.getSyllables().length ; i++)				// for every Syllable member of this ProsodicTextLine (NB each of which is a syllable, it being a ProsodicTextLine object)
			{
				for (var j = 0; j < prosodicTextLine.getSyllableByNumber(i).getProsodicVectors().length; j++)		// get all of the prosodic Vectors associated with this Syllable, read to loop through them					
				{
					if (prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).getGraphics() != null)
					{
						this.offerPolyLineToGraphicsStack(prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).getGraphics());		// push the vector's graphic to stack, available for re-use
						// changing polyline points could cause lines to unwantedly disappear, if references to them happen to be shared between several different vectors (shouldn't happen)
						prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).setGraphics(null);	// set graphics of shared link to null so as to avoid possibility of the same thing also happening at the OTHER end of the link (causing out-of-sync, line-disappearing problems)  (NB this was a big bug until 29/1/16) 
						prosodicTextLine.getSyllableByNumber(i).getProsodicVectorByNumber(j).setDrawn(false);
					}					
				}	// end of for every Prosodic Vector in this syllable

			}	// end of for every syllable

		}	// end of if has (not null) ProsodicTextLine

}	// end of moveParagraphProsodicVectorGraphicsToGraphicsStack function

DisplayText.prototype.offerPolyLineToGraphicsStack = function(polyLineOffered)
{
	// check whether polyline has not previously been added to graphics stack variable (already) as precuation before possibly pushing to said stack
	// does not involve prosodic matters by this point at all - a graphics matter. 

	var duplicateCount = 0;
	
	for (var i = 0; i < this.getProsodicVectorGraphicsStack().length; i++)		// run through contents of graphics stack (of polylines) checking for their id
	{
		if ( this.getProsodicVectorGraphicsStack()[i].getAttribute('id') == polyLineOffered.getAttribute('id') )
		{
			duplicateCount++;	// if offered polyline's id already found (ids should be unique) then (just out of interest) increment counter of how many times (any more than zero is unacceptable)
		}
	}	// end of for-every-polyline-in-graphics-stack loop

	if (duplicateCount == 0)									// // if (and only if) this offered polyline's id has not been found already present in graphics stack ...
	{
		this.getProsodicVectorGraphicsStack().push(polyLineOffered);		// ..., push this polyline to said stack ...
		polyLineOffered.setAttribute('points','0,0 0,1');		// ... then re-assign this vector's / polyline's graphic into a tiny 1 pixel long dot at 0,0 of containing element
console.log('offered & pushed to stack: ' + polyLineOffered.getAttribute('id'));				
	}
	
}		// end of offerPolyLineToGraphicsStack function

// TODO: save SVG (and DOM textnodes) as SVG file  http://stackoverflow.com/questions/8435537/convert-javascript-generated-svg-to-a-file  http://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an  http://techslides.com/save-svg-as-an-image  http://www.mikechambers.com/blog/2014/07/01/saving-svg-content-from-paper.js/





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



function DisplayTextLine(textLineArray)
{
	this.text = textLineArray;	// an array of syllabic and non-syllabic elements (in VocalicText and NonVocalicText objects)
	this.lineNumberWithinTotal = null;		// zero-indexed - first line is number 0 (presupposing no shuffling of lines once DisplayText populated)
	this.prosodicLineNumber = null;		// zero-index index number of prosodic line which is represented by this DisplayTextLine (where first prosodic line = 0, regardless of prosodic line's position within non-prosodic text)
	this.unformattedText = "";	// a plain text copy of the display text (i.e. in string form, not an array of VocalicText and NonVocalicText objects)
	
	for (var i = 0; i < this.text.length; i++)
	{
		this.unformattedText = this.unformattedText + this.text[i].getText();	// quietly build the plain text, for old times' sake
	}
		
}

DisplayTextLine.prototype.getDisplayText = function ()
{
	return this.text;	// return array of syllabic and non-syllabic elements in VocalicText and NonVocalicText objects in a DisplayTextLine object
}

DisplayTextLine.prototype.getLineNumberWithinTotal = function ()
{
	return this.lineNumberWithinTotal;	// return array of syllabic and non-syllabic elements
}

DisplayTextLine.prototype.setLineNumberWithinTotal = function (lineNumberWithinTotal)
{
	this.lineNumberWithinTotal = lineNumberWithinTotal;		// return array of syllabic and non-syllabic elements
}

DisplayTextLine.prototype.setProsodicLineNumber = function (prosodicLineNumber)
{
	this.prosodicLineNumber = prosodicLineNumber;
}

DisplayTextLine.prototype.getProsodicLineNumber = function ()
{
	return this.prosodicLineNumber;
}

DisplayTextLine.prototype.getProsodicLineProsodicStatistics = function(prosodicTextDoc)
{

	var statistics = null;

	if (! isNaN(this.getProsodicLineNumber()) && this.getProsodicLineNumber() != null)	// if the display text line actually has a prosodic line number associated
		{
	
			statistics = prosodicTextDoc.getProsodicLineByNumber(this.getProsodicLineNumber()).getStatistics();	// get the statistics object calculated for the prosodic text line associated with this display text line
		}

	return statistics;	// NB may be null, if this display text line has a prosodic text line but no actual syllables or statistics associated
}


DisplayTextLine.prototype.setUnformattedText = function(unformattedText)
{
	this.unformattedText = unformattedText;
	return this.unformattedText;
}

DisplayTextLine.prototype.getUnformattedText = function()
{
	return this.unformattedText;
}

DisplayTextLine.prototype.buildStatisticsString = function(statistics)
{
	// build a string (e.g. suitable for putting in a message box)

	var strStatistics = this.getUnformattedText();		// head statistics with the text of the line concerned
	
	strStatistics =  strStatistics +  '\n' + 'countRhyme: ' + statistics.countRhyme.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumRhymeValue: ' + statistics.sumRhymeValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanRhymeValue: ' + statistics.meanRhymeValue.toFixed(2);	
	strStatistics =  strStatistics +  '\n' + 'sumRhymeX: ' + statistics.sumRhymeX.toFixed(2);	
	strStatistics =  strStatistics +  '\n' + 'meanRhymeX: ' + statistics.meanRhymeX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumRhymeY: ' + statistics.sumRhymeY.toFixed(2);	
	strStatistics =  strStatistics +  '\n' + 'meanRhymeY: ' + statistics.meanRhymeY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevRhymeValue: ' + statistics.stdevRhymeValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevRhymeX: ' + statistics.stdevRhymeX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevRhymeY: ' + statistics.stdevRhymeY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'countAlliteration: ' + statistics.countAlliteration.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumAlliterationValue: ' + statistics.sumAlliterationValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanAlliterationValue: ' + statistics.meanAlliterationValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumAlliterationX: ' + statistics.sumAlliterationX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanAlliterationX: ' + statistics.meanAlliterationX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumAlliterationY: ' + statistics.sumAlliterationY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanAlliterationY: ' + statistics.meanAlliterationY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevAlliterationValue: ' + statistics.stdevAlliterationValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevAlliterationX: ' + statistics.stdevAlliterationX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevAliterationY: ' + statistics.stdevAliterationY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'countAssonance: ' + statistics.countAssonance.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumAssonanceValue: ' + statistics.sumAssonanceValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanAssonanceValue: ' + statistics.meanAssonanceValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumAssonanceX: ' + statistics.sumAssonanceX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanAssonanceX: ' + statistics.meanAssonanceX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumAssonanceY: ' + statistics.sumAssonanceY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanAssonanceY: ' + statistics.meanAssonanceY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevAssonanceValue: ' + statistics.stdevAssonanceValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevAssonanceX: ' + statistics.stdevAssonanceX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevAssonanceY: ' + statistics.stdevAssonanceY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'countConsonance: ' + statistics.countConsonance.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumConsonanceValue: ' + statistics.sumConsonanceValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanConsonanceValue: ' + statistics.meanConsonanceValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumConsonanceX: ' + statistics.sumConsonanceX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanConsonanceX: ' + statistics.meanConsonanceX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumConsonanceY: ' + statistics.sumConsonanceY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanConsonanceY: ' + statistics.meanConsonanceY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevConsonanceValue: ' + statistics.stdevConsonanceValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevConsonanceX: ' + statistics.stdevConsonanceX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'stdevConsonanceY: ' + statistics.stdevConsonanceY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'countOther: ' + statistics.countOther.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumOtherValue: ' + statistics.sumOtherValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanOtherValue: ' + statistics.meanOtherValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumOtherX: ' + statistics.sumOtherX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanOtherX: ' + statistics.meanOtherX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumOtherY: ' + statistics.sumOtherY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanOtherY: ' + statistics.meanOtherY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumValue: ' + statistics.sumValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanValue: ' + statistics.meanValue.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumX: ' + statistics.sumX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanX: ' + statistics.meanX.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'sumY: ' + statistics.sumY.toFixed(2);
	strStatistics =  strStatistics +  '\n' + 'meanY: ' + statistics.meanY.toFixed(2);

	return strStatistics;	// return whole string
}


function DisplayText(textToDisplay)
{
	this.text = textToDisplay;		// this is the text in/from objects of a form ready to display, but in ordinary text format (yet to be converted into DisplayTextLines)
	this.lines = new Array();		// lines should be an array (of lines)? or of DisplayTextLine objects ?
	this.lines = textToDisplay.split(/\n/);	// split text stream on new line (reg ex) to lines of text
	this.compositeProsodicVectorGraphics = [];		// an array of composite graphic vectors associated with the graphical and prosodic syllables within this text
	
	//var paper;

	this.verticalSpace = 50;		// spacing between lines (<P> paragraphs)
	this.verticalMargin = 120;		// spacing at top of page (used only
	this.fontSize = 30;
	this.lineY = 40;		// running total of vertical position of line

	this.standardLeaderLineVerticalOffset = 4; // actually a fraction denominator - i.e. what fraction (how far) of vertical spacing above lines of text at which begin/end leader lines to syllables (4 : 1/4)
	 

	this.svg ;//= document.getElementById('prosodicSVG');	// property of displaytext?
	this.textPane ;//= document.getElementById('textpane');	// property of displaytext?

	/*
	alliterationOffset = 1;
	assonanceOffset = 1;
	consonanceOffset = 1;
	*/

	this.prosodicVectorGraphicsStack = [];		// storage for instantiated DOM graphics (eg polylines) unused at present (maybe off-screen) but available for re-definition and re-use
	
	
	
	return this.lines.length;			// return total number of lines (delete?)
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
	return this.lines[this.lines.length - 1];
}

DisplayText.prototype.getCompositeProsodicVectorGraphics = function ()
{
	return this.compositeProsodicVectorGraphics;
}

//getCompositeProsodicVectorGraphics

DisplayText.prototype.setCompositeProsodicVectorGraphics = function (compositeProsodicVectorGraphics)
{
	this.compositeProsodicVectorGraphics = compositeProsodicVectorGraphics;		// would this ever be used ??
}

DisplayText.prototype.getCompositeProsodicVectorGraphicByNumber = function (vectorNumber)
{
	return this.compositeProsodicVectorGraphics[vectorNumber];
}

DisplayText.prototype.setCompositeProsodicVectorGraphicByNumber = function (vectorNumber,compositeProsodicVectorGraphic)
{
	this.compositeProsodicVectorGraphics[vectorNumber] = compositeProsodicVectorGraphic;
}

DisplayText.prototype.pushCompositeProsodicVectorGraphic = function (compositeProsodicVectorGraphic)
{
	compositeProsodicVectorGraphic.setCompositeVectorGraphicNumber(this.compositeProsodicVectorGraphics.length);
	this.compositeProsodicVectorGraphics.push(compositeProsodicVectorGraphic);	// add a new composite prosodic vector graphic
	return compositeProsodicVectorGraphic;
}


DisplayText.prototype.setVerticalSpace = function(verticalSpace)
{
	this.verticalSpace = verticalSpace;
	return this.verticalSpace;
}
DisplayText.prototype.setVerticalMargin = function(verticalMargin)
{
	this.verticalMargin = verticalMargin;
	return this.verticalMargin;
}
DisplayText.prototype.setFontSize = function(fontSize)
{
	this.fontSize = fontSize;
	return this.fontSize;
}
DisplayText.prototype.setLineY = function(lineY)
{
	this.lineY = lineY;
	return this.lineY;
}
DisplayText.prototype.setStandardLeaderLineVerticalOffset = function(standardLeaderLineVerticalOffset)
{
	this.standardLeaderLineVerticalOffset = standardLeaderLineVerticalOffset;
	return this.standardLeaderLineVerticalOffset;
}
DisplayText.prototype.setSvg = function(svg)
{
	this.svg = svg;
	return this.svg;
}
DisplayText.prototype.setTextPane = function(textPane)
{
	this.textPane = textPane;
	return this.textPane;
}
DisplayText.prototype.setProsodicVectorGraphicsStack = function(prosodicVectorGraphicsStack)		// storage for instantiated DOM graphics (eg polylines) unused at present (maybe off-screen) but available for re-definition and re-use
{
	this.prosodicVectorGraphicsStack = prosodicVectorGraphicsStack;
	return this.prosodicVectorGraphicsStack;
}
DisplayText.prototype.getVerticalSpace = function()
{
	return this.verticalSpace;
}
DisplayText.prototype.getVerticalMargin = function()
{
	return this.verticalMargin;
}
DisplayText.prototype.getFontSize = function()
{
	return this.fontSize;
}
DisplayText.prototype.getLineY = function()
{
	return this.lineY;
}
DisplayText.prototype.getStandardLeaderLineVerticalOffset = function()
{
	return this.standardLeaderLineVerticalOffset;
}
DisplayText.prototype.getSvg = function()
{
	return this.svg;
}
DisplayText.prototype.getTextPane = function()
{
	return this.textPane;
}
DisplayText.prototype.getProsodicVectorGraphicsStack = function()		// storage for instantiated DOM graphics (eg polylines) unused at present (maybe off-screen) but available for re-definition and re-use
{
	return this.prosodicVectorGraphicsStack;
}

DisplayText.prototype.getTextNodeBoundingClientRect = function(textNode, range)
{
	// from a browser DOM, returns a reference to the BoundingClientRect of a childNode of a <p> paragraph element
	// i.e. in this context, the BoundingClientRect of a Syllable object's text within a paragraph 
	// textNode - a DOM textNode (e.g. some childNode of a paragraph's text)
	// range - a DOM reference to a select-able range within a document 

	range.selectNodeContents(textNode);

	if (range.getBoundingClientRect)	// could try checking (or try ...), but don't, for the moment - just return
	{
		return range.getBoundingClientRect();
	}

	else return null;		// oops - old browser ?	

}	// end of getTextNodeBoundingClientRect

DisplayText.prototype.drawProsodicHarmonyLinkWithLeaderLines = function(context,prosodicVector)
{
	// function - draws a line (with leader lines) between 2 syllable text objects to represent a prosodic vector / prosodic harmony link (colour coded for link type, width for strength)
	// returns an SVG polyline reference in DOM

	// context - svg element (could be from global or object)
	
	// NB paper argument not required if not using Raphael.js - could be used to pass in svg element though
	
	var linkColour;
	var linkWidth;
	
	switch(prosodicVector.getLinkType())
	{ 
	// assign lines' colur according to prosodic harmony link type 
	case 'rhyme':	// rhyme - black
		linkColour = '#000000'
		//	linkColour = '#FFFFFF'							
		break;		
	case 'alliteration':	// alliteration - blue
		linkColour = '#0000FF'
		//	linkColour = '#FFFFFF'					
		break;
	case 'assonance':	// assonance - green
		linkColour = '#00FF00'
	//linkColour = '#FFFFFF'		
		break;
	case 'consonance':	// consonance - red
		linkColour = '#FF0000'
	//linkColour = '#FFFFFF'		
		break;	
	// assign lines' width according to prosodic harmony link strength
	default:
		linkColour = '#000000'
	}

	linkWidth = prosodicVector.getValue() * prosodicVector.getValue();	// square value (0-1) to accentuate differences (weak links very thin line, even strong links not very thick line)

	var strText = this.getSvg().childNodes.length + 'declared-for-' + prosodicVector.getSyllableA().getText() + prosodicVector.getSyllableA().getProsodicLineNumber() + prosodicVector.getSyllableA().getSyllableNumber() + '-' + prosodicVector.getSyllableB().getText() + prosodicVector.getSyllableB().getProsodicLineNumber() + prosodicVector.getSyllableB().getSyllableNumber() + '-' + prosodicVector.getLinkType(); 
	
	return this.drawPolyLineFromTextToTextWithLeader(document.createRange(),this.getSvg(),prosodicVector.getSyllableA().getTextNodeBoundingRect(), prosodicVector.getSyllableB().getTextNodeBoundingRect(), linkColour, linkWidth, prosodicVector.getLinkType() + (1/prosodicVector.getValue()), strText);
	
	// class name = prosodic vector's type + inverse of strength (i.e. strength 0.25 = 4, 0.5 = 2, 1 = 1) e.g. assonance at strength 0.5 = "assonance2"
	 	
}	// end of drawProsodicHarmonyLinkWithLeaderLines function





DisplayText.prototype.drawPolyLineFromTextToTextWithLeader = function(textContext, graphicalContext, textBoundingRect1, textBoundingRect2, colour, width, className, strText)
{ 
	// drawing line from & to mid-horizontal(x)-points of text - directly, not orthogonal, with leader lines up & down

	// 'textContext' is an argument which can represent the text to be linked by a line, e.g., the Raphael paper object, or the document, or a range within the document, ... (to aid portability)
	// 'graphicalContext' is an argument which can represent the object/area in which graphics are drawn, e.g., the Raphael paper object, or the SVG element, ... (to aid portability)
	
	// textContent - range object created from document - http://sebastian.germes.in/blog/2011/11/bounding-box-textnodes-js/
	// graphicalContext - svg element within document
	// textBoundingRect1 - bounding rectangle of a textNode within DOM (the origin syllable of the prosodic vector)
	// textObject2 - bounding rectangle of a textNode within DOM (the destination syllable of the prosodic vector)	


	
	var fromCoordinates = this.getTextCoordinates(textBoundingRect1);		// use bounding rectangle for (selected range of) textNode, stored in Syllable object
	var toCoordinates = this.getTextCoordinates(textBoundingRect2);

	var fromX = fromCoordinates.getX();
	var fromY = fromCoordinates.getY();
	var toX = toCoordinates.getX();
	var toY = toCoordinates.getY();

	//var typeName = className.substring(0,className.);	// get the class name up until numbers appear 
		
	var colourOffset = 0;	
		
	switch (colour)
	{
	case '#0000FF' :
		colourOffset = -1;
		break;
	case '#00FF00' :
		colourOffset = 1;
		break;
	case '#FF0000' :
		colourOffset = 2;
		break;		
	}	 			// temporary trial, to see if offset lines can be accomplished

// for the moment, make both (origin) up and (destination) down distances, for origin and destination, equal to half of the vertical spacing
// could vary according to colour(type), etc

	var upDistance = this.getVerticalSpace() / this.getStandardLeaderLineVerticalOffset();
	var downDistance = this.getVerticalSpace() / this.getStandardLeaderLineVerticalOffset();	


	var polyLine = document.createElementNS('http://www.w3.org/2000/svg','polyline');	// create a polyline


	var fromPoint = graphicalContext.createSVGPoint();
//	fromPoint.x = fromX;
	fromPoint.x = fromX - colourOffset;
	fromPoint.y = fromY;

	var fromLeaderPoint = graphicalContext.createSVGPoint();	// point above origin
	//fromLeaderPoint.x = fromX;
	fromLeaderPoint.x = fromX - colourOffset;
	//fromLeaderPoint.y = fromY - upDistance;
	fromLeaderPoint.y = fromY - upDistance + colourOffset;

	var toPoint = graphicalContext.createSVGPoint();
	//toPoint.x = toX;
	toPoint.x = toX + colourOffset;
	toPoint.y = toY;
	
	var toLeaderPoint = graphicalContext.createSVGPoint();	// point above destination
//	toLeaderPoint.x = toX;
	toLeaderPoint.x = toX + colourOffset;
	//toLeaderPoint.y = toY - downDistance;
	toLeaderPoint.y = toY - downDistance + colourOffset;


	//http://stackoverflow.com/questions/10940316/how-to-use-attrs-stroke-dasharray-stroke-linecap-stroke-linejoin-in-raphaeljs

	// pushing may not give adequate access to object in javascript - just in case, direct indexing might do so



	polyLine.points.appendItem(fromPoint);
	polyLine.points.appendItem(fromLeaderPoint);
	polyLine.points.appendItem(toLeaderPoint);
	polyLine.points.appendItem(toPoint);

	polyLine.style.fill = 'none';
	polyLine.style.stroke = colour;
	polyLine.setAttribute('stroke-width',width);
	polyLine.setAttribute('id',strText);

	// return array of lines (to enable switching on & off)


	
 	
	graphicalContext.appendChild(polyLine);	// append polyline to page's SVG element		

	
console.log('polyline added - total polylines on SVG = ' + this.getSvg().childNodes.length);
	return polyLine;	// return polyline DOM object (to enable switching on/off i.e. toggling of visibility style from 'visible' to 'hidden')

}	// end of drawPolyLineFromTextToTextWithLeader function


 DisplayText.prototype.reUsePolyLineFromTextToTextWithLeader = function(textContext, polyLine, textBoundingRect1, textBoundingRect2, colour, width, className)
{ 
	// drawing line from & to mid-horizontal(x)-points of text - directly, not orthogonal, with leader lines up & down

	// 'textContext' is an argument which can represent the text to be linked by a line, e.g., the Raphael paper object, or the document, or a range within the document, ... (to aid portability)
	// 'graphicalContext' is an argument which can represent the object/area in which graphics are drawn, e.g., the Raphael paper object, or the SVG element, ... (to aid portability)
	
	// textContent - range object created from document - http://sebastian.germes.in/blog/2011/11/bounding-box-textnodes-js/
	// graphicalContext - svg element within document
	// textBoundingRect1 - bounding rectangle of a textNode within DOM (the origin syllable of the prosodic vector)
	// textObject2 - bounding rectangle of a textNode within DOM (the destination syllable of the prosodic vector)	


	
	var fromCoordinates = this.getTextCoordinates(textBoundingRect1);		// use bounding rectangle for (selected range of) textNode, stored in Syllable object
	var toCoordinates = this.getTextCoordinates(textBoundingRect2);

	var fromX = fromCoordinates.getX();
	var fromY = fromCoordinates.getY();
	var toX = toCoordinates.getX();
	var toY = toCoordinates.getY();
		
	var colourOffset = 0;	
		
	switch (colour)
	{
	case '#0000FF' :
		colourOffset = -1;
		break;
	case '#00FF00' :
		colourOffset = 1;
		break;
	case '#FF0000' :
		colourOffset = 2;
		break;		
	}	 			// temporary trial, to see if offset lines can be accomplished

	// for the moment, make both (origin) up and (destination) down distances, for origin and destination, equal to half of the vertical spacing
	// could vary according to colour(type), etc

	var upDistance = this.getVerticalSpace() / this.getStandardLeaderLineVerticalOffset();		// using global variable (document property?) verticalSpace between lines
	var downDistance = this.getVerticalSpace() / this.getStandardLeaderLineVerticalOffset();	

	var strPoints = (fromX - colourOffset) + "," + fromY + " " + (fromX - colourOffset) + "," + (fromY - upDistance + colourOffset) + " " + (toX + colourOffset) + "," + (toY - downDistance + colourOffset) + " " + (toX + colourOffset) + "," + toY;
	// build a text string defining new coordinates of polyline 

	polyLine.setAttribute('points',strPoints);		// reset points attribute of this polyline by text string, to re-use as a depiction of another link (and save having to declare a new SVG polyline) 

	polyLine.style.fill = 'none';
	polyLine.style.stroke = colour;
	polyLine.setAttribute('stroke-width',width);	

console.log('polyline re-used ' + polyLine.getAttribute('points') + ' | ' + polyLine.getAttribute('id'));
	return polyLine;	// return polyline DOM object (to enable switching on/off i.e. toggling of visibility style from 'visible' to 'hidden')

}	// end of reUsePolyLineFromTextToTextWithLeader function

DisplayText.prototype.reUseProsodicHarmonyLinkWithLeaderLinesGraphic = function(polylineFromGraphicsStack,prosodicVector)
{
	// function - draws a line (with leader lines) between 2 syllable text objects to represent a prosodic vector / prosodic harmony link (colour coded for link type, width for strength)
	// returns an array with the 3 parts of the line (& leader line) graphic elements

	// NB paper argument required if not using Raphael.js
	
	var linkColour;
	var linkWidth;
	
	switch(prosodicVector.getLinkType())
	{ 
	// assign lines' colur according to prosodic harmony link type 
	case 'rhyme':	// rhyme - black
		linkColour = '#000000'
		break;		
	case 'alliteration':	// alliteration - blue
		linkColour = '#0000FF'
		break;
	case 'assonance':	// assonance - green
		linkColour = '#00FF00'
		break;
	case 'consonance':	// consonance - red
		linkColour = '#FF0000'
		break;	
	// assign lines' width according to prosodic harmony link strength
	default:
		linkColour = '#000000'
	}

	linkWidth = prosodicVector.getValue() * prosodicVector.getValue();	// square value (0-1) to accentuate differences (weak links very thin line, even strong links not very thick line)

	// return lineFromTextToTextWithLeader(paper,prosodicVector.getSyllableA().getSyllableGraphic(), prosodicVector.getSyllableB().getSyllableGraphic(), linkColour, linkWidth);
	return this.reUsePolyLineFromTextToTextWithLeader(document.createRange(),polylineFromGraphicsStack,prosodicVector.getSyllableA().getTextNodeBoundingRect(), prosodicVector.getSyllableB().getTextNodeBoundingRect(), linkColour, linkWidth, prosodicVector.getLinkType() + (1/prosodicVector.getValue()));
	// class name = prosodic vector's type + inverse of strength (i.e. strength 0.25 = 4, 0.5 = 2, 1 = 1) e.g. assonance at strength 0.5 = "assonance2"
	 	
}



DisplayText.prototype.getPolyLineFromTextToTextWithLeader = function(textContext, graphicalContext, textBoundingRect1, textBoundingRect2, colour, width, className)
{ 
	// drawing line from & to mid-horizontal(x)-points of text - directly, not orthogonal, with leader lines up & down

	// 'textContext' is an argument which can represent the text to be linked by a line, e.g., the Raphael paper object, or the document, or a range within the document, ... (to aid portability)
	// 'graphicalContext' is an argument which can represent the object/area in which graphics are drawn, e.g., the Raphael paper object, or the SVG element, ... (to aid portability)
	
	// textContent - range object created from document - http://sebastian.germes.in/blog/2011/11/bounding-box-textnodes-js/
	// graphicalContext - svg element within document
	// textBoundingRect1 - bounding rectangle of a textNode within DOM (the origin syllable of the prosodic vector)
	// textObject2 - bounding rectangle of a textNode within DOM (the destination syllable of the prosodic vector)	


	
	var fromCoordinates = getTextCoordinates(textBoundingRect1);		// use bounding rectangle for (selected range of) textNode, stored in Syllable object
	var toCoordinates = getTextCoordinates(textBoundingRect2);

	var fromX = fromCoordinates.getX();
	var fromY = fromCoordinates.getY();
	var toX = toCoordinates.getX();
	var toY = toCoordinates.getY();

	//var typeName = className.substring(0,className.);	// get the class name up until numbers appear 
		
	var colourOffset = 0;	
		
	switch (colour)
	{
	case '#0000FF' :
		colourOffset = -1;
		break;
	case '#00FF00' :
		colourOffset = 1;
		break;
	case '#FF0000' :
		colourOffset = 2;
		break;		
	}	 			// temporary trial, to see if offset lines can be accomplished

// for the moment, make both (origin) up and (destination) down distances, for origin and destination, equal to half of the vertical spacing
// could vary according to colour(type), etc

	var upDistance = this.getVerticalSpace() / this.getStandardLeaderLineVerticalOffset();
	var downDistance = this.getVerticalSpace() / this.getStandardLeaderLineVerticalOffset();	


	var polyLine = document.createElementNS('http://www.w3.org/2000/svg','polyline');	// create a polyline


	var fromPoint = graphicalContext.createSVGPoint();
//	fromPoint.x = fromX;
	fromPoint.x = fromX - colourOffset;
	fromPoint.y = fromY;

	var fromLeaderPoint = graphicalContext.createSVGPoint();	// point above origin
	//fromLeaderPoint.x = fromX;
	fromLeaderPoint.x = fromX - colourOffset;
	//fromLeaderPoint.y = fromY - upDistance;
	fromLeaderPoint.y = fromY - upDistance + colourOffset;

	var toPoint = graphicalContext.createSVGPoint();
	//toPoint.x = toX;
	toPoint.x = toX + colourOffset;
	toPoint.y = toY;
	
	var toLeaderPoint = graphicalContext.createSVGPoint();	// point above destination
//	toLeaderPoint.x = toX;
	toLeaderPoint.x = toX + colourOffset;
	//toLeaderPoint.y = toY - downDistance;
	toLeaderPoint.y = toY - downDistance + colourOffset;


	var strPoints = (fromX - colourOffset) + "," + fromY + " " + (fromX - colourOffset) + "," + (fromY - upDistance + colourOffset) + " " + (toX + colourOffset) + "," + (toY - downDistance + colourOffset) + " " + (toX + colourOffset) + "," + toY;
	
	//http://stackoverflow.com/questions/10940316/how-to-use-attrs-stroke-dasharray-stroke-linecap-stroke-linejoin-in-raphaeljs

	// pushing may not give adequate access to object in javascript - just in case, direct indexing might do so

	// make lines invisible to begin with

	polyLine.points.appendItem(fromPoint);
	polyLine.points.appendItem(fromLeaderPoint);
	polyLine.points.appendItem(toLeaderPoint);
	polyLine.points.appendItem(toPoint);

	polyLine.style.fill = 'none';
	polyLine.style.stroke = colour;
	polyLine.setAttribute('stroke-width',width);

console.log('polyline added - string = ' + strPoints);
	return polyLine;	// return polyline DOM object (to enable switching on/off i.e. toggling of visibility style from 'visible' to 'hidden')

}	// end of getPolyLineFromTextToTextWithLeader function


DisplayText.prototype.getProsodicHarmonyLinkWithLeaderLines = function(paper,prosodicVector)
{
	// function - draws a line (with leader lines) between 2 syllable text objects to represent a prosodic vector / prosodic harmony link (colour coded for link type, width for strength)
	// returns an array with the 3 parts of the line (& leader line) graphic elements

	// NB paper argument required if not using Raphael.js
	
	var linkColour;
	var linkWidth;
	
	switch(prosodicVector.getLinkType())
	{ 
	// assign lines' colur according to prosodic harmony link type 
	case 'rhyme':	// rhyme - black
		linkColour = '#000000'
		break;		
	case 'alliteration':	// alliteration - blue
		linkColour = '#0000FF'
		break;
	case 'assonance':	// assonance - green
		linkColour = '#00FF00'
		break;
	case 'consonance':	// consonance - red
		linkColour = '#FF0000'
		break;	
	// assign lines' width according to prosodic harmony link strength
	default:
		linkColour = '#000000'
	}

	linkWidth = prosodicVector.getValue() * prosodicVector.getValue();	// square value (0-1) to accentuate differences (weak links very thin line, even strong links not very thick line)

	return this.getPolyLineFromTextToTextWithLeader(document.createRange(),this.getSvg(),prosodicVector.getSyllableA().getTextNodeBoundingRect(), prosodicVector.getSyllableB().getTextNodeBoundingRect(), linkColour, linkWidth, prosodicVector.getLinkType() + (1/prosodicVector.getValue()));
	// class name = prosodic vector's type + inverse of strength (i.e. strength 0.25 = 4, 0.5 = 2, 1 = 1) e.g. assonance at strength 0.5 = "assonance2"
	 	
}		// end of getProsodicHarmonyLinkWithLeaderLines


DisplayText.prototype.getTextCoordinates = function(boundingRect)
{

	// NB:- F12 CPU profiling showed significant overhead (50% of drawing links' time) for getBoundingClientRect - cf http://dcousineau.com/blog/2013/09/03/high-performance-js-tip/
	// therefore getBoundingClientRect once only on creation of textNode for Syllable, and to that thereafter refer? 
	
	// boundingRect - a bounding rectangle (e.g. from a selected range in a document, such as a TextNode)
	
	var textX = boundingRect.left + (boundingRect.width / 3);		// divide-by-half seems to pitch line a little too far to right
	var textY = boundingRect.top + (boundingRect.height / 3);

	
	return new xyValue(textX,textY);		// return an X/Y value	

}	// end of getTextCoordinates




DisplayText.prototype.splitDisplayTextToVocalicAndNonVocalicSegments = function()
{
	// function - NB uses shed load of global variables here
	
// split/segment display text into vocalic and non-vocalic (punctuation, spaces, comments, line numbers) variables, line by line
// NB problem here, had to rename counter from i to lineNumber - unforseen (scope?) problem whereby loop in called (splitting) function incremented namesake variable in calling function !
	for (lineNumber=0; lineNumber<this.getNumberOfLines(); lineNumber++)	// for every line in the text
	{	
		var lineText = this.getLineByNumber(lineNumber);	// get each line of text - at this point, each line is just a string of text, so no need to call as DisplayTextLine 
// text is in an array of lines, each cell of which has a line of ordinary text - this line splitting done with the DisplayText's constructor - need to replace these unformatted text lines with DisplayTextLines populated by VocalicText and NonVocalicText (see a few lines on)
		lineText = prosodicTextProcessor.splitTextToVocalAndNonVocal(lineText);	// split each line into array of elements vocalic and non-vocalic
//!/		displayText.setLineByNumber(lineNumber,lineText);	// split each line into elements vocalic and non-vocalic
		var displayTextLine = new DisplayTextLine(lineText);

		this.setLineByNumber(lineNumber,displayTextLine);	// set a new DisplayTextLine to replace the unformatted text line currently occupying this space
		//displayText.setLineByNumber(new DisplayTextLine(lineNumber,lineText));	// set a new DisplayTextLine to replace the unformatted text line currently occupying this space 		
	}
}		// end of splitDisplayTextToVocalicAndNonVocalicSegments function
//TO DO: go through each line, combining in an array each non-vocalic text and each syllable within it
//must maintain syllable text graphic objects as properties (of a syllable object?) 
//must record which syllables belong to which vocalic text (ie keep note of groups of syllables) to determine which syllable has stress





function VocalicText(vocalicText)
{
	this.text = vocalicText;
	this.syllables = new Array();
}

VocalicText.prototype.constructor.name = 'VocalicText';		// fudge for Internet Explorer  http://stackoverflow.com/questions/25140723/constructor-name-is-undefined-in-internet-explorer

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
			vocalicTextString = vocalicTextString + this.syllables[i].getText();	// build up vocalic string from syllables
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
	this.boolComment = false;	// flag to show whether this is comment text or not
}

NonVocalicText.prototype.constructor.name = 'NonVocalicText';		// fudge for Internet Explorer  http://stackoverflow.com/questions/25140723/constructor-name-is-undefined-in-internet-explorer

NonVocalicText.prototype.getText = function ()
{
	return this.text;
}

NonVocalicText.prototype.setBoolComment = function (boolComment)
{
	this.boolComment = boolComment;
}

NonVocalicText.prototype.getBoolComment = function ()
{
	return this.boolComment;
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
	this.soundexesque = "";			// Soundex-like string for phonetic comparison

	this.onsetSoundexesque = null;
	this.nucleusSoundexesque = null;
	this.codaSoundexesque = null;
	
	this.syllableNumber;			// number of syllable within line (usually 0-6 for Cornish meter)
	this.prosodicLineNumber;		// number of line within *prosodic text* within which is found the syllable
	this.vectorOriginStrings = new Array ();		// x,y,type,value (,additional) - prosodic harmony links ('originating' from this (earlier) syllable - may be others where this syllable is the 'destination' (later))
	this.vectorDestinationStrings = new Array ();	// x,y,type,value (,additional) - prosodic harmony links associated with this 'destination' i.e. later in text syllable 
	this.prosodicVectors = new Array();		// array of prosodic vectors (with this syllable at either end - either 'origin' (earlier) or 'destination' (later in text)) already instantiated in memory
	this.textNode = null;			// reference to textNode in DOM which d'represent this syllable
	this.textNodeBoundingRect = null;	// cache the syllable's TextNode's bounding rect on creation, for performance reasons - http://dcousineau.com/blog/2013/09/03/high-performance-js-tip/
	
	this.statistics = null;
	//this.numberInLine = 0;
	//this.lineNumberInText = 0;
	
	// this.previousSyllable = null;	// previous syllable in vocalic text group/'word'	// possibly obtainable by reference to vocalicText's syllableArray
	// this.nextSyllable = null;		// next syllable in vocalic text group/'word'
	// this.isFirstSyllableInWord = false;
	// this.isFinalSyllableInWord = false;
}

Syllable.prototype.constructor.name = 'Syllable';		// fudge for Internet Explorer  http://stackoverflow.com/questions/25140723/constructor-name-is-undefined-in-internet-explorer

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

Syllable.prototype.pushToVectorOriginStrings = function (strVector)
{
	this.vectorOriginStrings.push(strVector);
	return this.vectorOriginStrings[this.vectorOriginStrings.length - 1];
}

Syllable.prototype.setVectorOriginStrings = function (vectorStringsArray)
{
	this.vectorOriginStrings = vectorStringsArray;
}

Syllable.prototype.getVectorOriginStrings = function ()
{
	return this.vectorOriginStrings;
}

Syllable.prototype.getVectorOriginStringByIndex = function (vectorStringIndex)
{
	return this.vectorOriginStrings[vectorStringIndex];
}

Syllable.prototype.getVectorOriginStringByIndex = function (vectorStringIndex, strVector)
{
	this.vectorOriginStrings[vectorStringIndex] = strVector;
}


Syllable.prototype.pushToVectorDestinationStrings = function (strVector)
{
	this.vectorDestinationStrings.push(strVector);
	return this.vectorDestinationStrings[this.vectorDestinationStrings.length - 1];
}

Syllable.prototype.setVectorDestinationStrings = function (vectorStringsArray)
{
	this.vectorDestinationStrings = vectorStringsArray;
}

Syllable.prototype.getVectorDestinationStrings = function ()
{
	return this.vectorDestinationStrings;
}

Syllable.prototype.getVectorDestinationStringByIndex = function (vectorStringIndex)
{
	return this.vectorDestinationStrings[vectorStringIndex];
}

Syllable.prototype.getVectorDestinationStringByIndex = function (vectorStringIndex, strVector)
{
	this.vectorDestinationStrings[vectorStringIndex] = strVector;
}

Syllable.prototype.pushProsodicVector = function (prosodicVector)
{
	this.prosodicVectors.push(prosodicVector);
}

Syllable.prototype.getProsodicVectors = function ()
{
	return	this.prosodicVectors;	// return all instantiated vectors associated with this syllable 
}

Syllable.prototype.getProsodicVectorByNumber  = function (index)
{
	return this.prosodicVectors[index];		// return a specific instantiated prosodic vector
}





Syllable.prototype.setSyllableNumber = function (intSyllableNumber)
{
	this.syllableNumber = intSyllableNumber;
}

Syllable.prototype.getSyllableNumber = function ()
{
	return this.syllableNumber;
}

Syllable.prototype.setProsodicLineNumber = function (intProsodicLineNumber)
{
	this.prosodicLineNumber = intProsodicLineNumber;
}

Syllable.prototype.getProsodicLineNumber = function ()
{
	return this.prosodicLineNumber;
}

Syllable.prototype.setSyllableGraphic = function (syllableGraphic)
{
	this.syllableGraphic = syllableGraphic;
}

Syllable.prototype.getSyllableGraphic = function ()
{
	return this.syllableGraphic;
}

//Syllable.prototype.setTextNode = function (textNode, textNodeBoundingRect)
Syllable.prototype.setTextNode = function (textNode)
{
	this.textNode = textNode;
	//this.textNodeBoundingRect = textNodeBoundingRect;		// for performance reasons, 'cacheing' bounding rectangle of syllable text from browser page - http://dcousineau.com/blog/2013/09/03/high-performance-js-tip/
}

Syllable.prototype.getTextNode = function ()
{
	return this.textNode;
}

Syllable.prototype.setTextNodeBoundingRect = function (textNodeBoundingRect)
{
	// for performance reasons, 'cacheing' bounding rectangle of syllable text from browser page - http://dcousineau.com/blog/2013/09/03/high-performance-js-tip/ 
	this.textNodeBoundingRect = textNodeBoundingRect;
}

Syllable.prototype.getTextNodeBoundingRect = function ()
{ 
	return this.textNodeBoundingRect;
}


Syllable.prototype.getOnsetSoundexesque = function()
{
	return this.onsetSoundexesque;
}

Syllable.prototype.getNucleusSoundexesque = function()
{
	return this.nucleusSoundexesque;
}


Syllable.prototype.getCodaSoundexesque = function()
{
	return this.codaSoundexesque;
}

Syllable.prototype.setOnsetSoundexesque = function(onsetSoundexesque)
{
	this.onsetSoundexesque = onsetSoundexesque;
}

Syllable.prototype.setNucleusSoundexesque = function(nucleusSoundexesque)
{
	this.nucleusSoundexesque = nucleusSoundexesque;
}

Syllable.prototype.setCodaSoundexesque = function(codaSoundexesque)
{
	this.codaSoundexesque = codaSoundexesque;
}

Syllable.prototype.setStatistics = function(statistics)
{
	this.statistics = statistics;
	return statistics;
}

Syllable.prototype.getStatistics = function()
{
	return this.statistics;
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
				 // first, get any character(s) to left of breaking punctuation (in case regular expression splitting has left any consonant-consonant situations) and add to syllable
				if (syllable.getNucleus() == "")	// if nucleus of preceding is blank, set anything to left of breaking coda as nucleus
				{
					syllable.setNucleus(splitText[syllableElementCounter].toLowerCase().substring(0,splitText[syllableElementCounter].toLowerCase().search(breakingPunctuationRegEx)))
					//syllable.setNucleus(syllable.getNucleus() + splitText[syllableElementCounter].toLowerCase());		// fine to set nucleus as vowel for V or VC
					syllable.setText(syllable.getText() + splitText[syllableElementCounter].toLowerCase().substring(0,splitText[syllableElementCounter].search(breakingPunctuationRegEx)));			// set syllable's text likewise
					if (splitText[syllableElementCounter].toLowerCase().substring(0,splitText[syllableElementCounter].search(breakingPunctuationRegEx)).match(vowelsRegEx))	// if this text is a vowel (of however many characters), append V to syllable type,
					{
						syllable.setType(syllable.getType() + "V");
					}
					else	// else if this text is not a vowel, must be a consonant, so append C to syllable type
					{
						syllable.setType(syllable.getType() + "C");
					}				
				}	//end of if-nucleus-blank
				else if (syllable.getCoda() == "")	// else if coda of preceding is blank, set anything to left of breaking punctuation as coda
				{
					syllable.setCoda(splitText[syllableElementCounter].toLowerCase().substring(0,splitText[syllableElementCounter].toLowerCase().search(breakingPunctuationRegEx)))
					//syllable.setNucleus(syllable.getNucleus() + splitText[syllableElementCounter].toLowerCase());		// fine to set nucleus as vowel for V or VC
					syllable.setText(syllable.getText() + splitText[syllableElementCounter].toLowerCase().substring(0,splitText[syllableElementCounter].search(breakingPunctuationRegEx)));			// set syllable's text likewise
					if (splitText[syllableElementCounter].toLowerCase().substring(0,splitText[syllableElementCounter].search(breakingPunctuationRegEx)).match(vowelsRegEx))	// if this text is a vowel (of however many characters), append V to syllable type,
					{
						syllable.setType(syllable.getType() + "V");
					}
					else	// else if this text is not a vowel, must be a consonant, so append C to syllable type
					{
						syllable.setType(syllable.getType() + "C");
					}									
				}	//end of if-coda-blank

				 // else .... oh dear (problem - lost character)
				syllable.setText(syllable.getText() + splitText[syllableElementCounter].match(breakingPunctuationRegEx)[0]);	// append breaking character to previous text
			 	prosodicTextProcessor.completeSyllableParts(syllable);	// make sure all syllable parts data (onset, nucleus, coda) are completed
			
			 	prosodicTextProcessor.syllableCompleted(syllable,syllableArray,vowelCounter,consonantCounter);	// this syllable is complete			
			 	vowelCounter = 0;		// set vowel counter back to zero
			 	consonantCounter = 0;	// set consonant counter back to zero

			 	syllable = new Syllable("","","","");	// start afresh with 'new' syllable 

			 	//splitText[syllableElementCounter] = splitText[syllableElementCounter].replace(breakingPunctuationRegEx,"");	// remember to strip breaking punctuation from this text, 'going forward' as they say
			 	if (splitText[syllableElementCounter].length > splitText[syllableElementCounter].search(breakingPunctuationRegEx) + 1) 	// if broken split text longer than the point at which the breaking punctuation is found (the text before has, by now, been processed)
			 	{
			 		splitText[syllableElementCounter] = splitText[syllableElementCounter].substring(splitText[syllableElementCounter].search(breakingPunctuationRegEx) + 1);	// then set the split text now to be only that part after the breaking punctuation 
			 	}
			 	else		// else if breaking character was last, then this bit of split text will just be blank 
			 	{
			 		splitText[syllableElementCounter] = "";		// (else split text will just be blank)
			 	}
			 		
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
	if (completedSyllable.getText().length > 0)	// check that syllable actually consists of text
	{
		var syllableCopy = new Syllable(completedSyllable.getText(),completedSyllable.getOnset(),completedSyllable.getNucleus(),completedSyllable.getCoda());		// create a new object (not a reference to the Syllable passed into this function)
		syllableCopy.setOnsetSoundexesque(this.soundexesqueAssign(completedSyllable.getOnset()));		// calculate & cache the Soundex-esque values for parts of the syllable
		syllableCopy.setNucleusSoundexesque(this.soundexesqueAssign(completedSyllable.getNucleus()));
		syllableCopy.setCodaSoundexesque(this.soundexesqueAssign(completedSyllable.getCoda()));		
		syllableCopy.setType(completedSyllable.getType());
		presentSyllableArray.push(syllableCopy);		// push (brand new, not a reference to existing) Syllable onto array for this vocalic text / 'word'
		
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
	var stressedIndexValue = Math.max(arrayLength - 2,0);	// whichever is greater, the length -1 (to zero indexed -2) or zero (for zero indexed)
	
	completedSyllableArray[stressedIndexValue].setStress(true);	// flag penultimate (or first/only) syllable as bearing the stress
	
	// could call in exception lookup words from ProsodicTextProcessor in here
}

ProsodicTextProcessor.prototype.setVowelLength = function(syllable)
{
	// TODO: depends on position of syllable, nature of consonant(s) in nucleus or coda, ...
}


ProsodicTextProcessor.prototype.setupSoundexesque = function()
{
	// function - initialises ProsodicTextProcessor's from CSV string of Soundex-esque integer value,x,y,z 
		
	
	var strSoundexesque = this.getSoundexesque();			// temporary - use global variable - TODO: read from file stream if required
	var soundexesqueAssociativeArray = new Array();
	// declare a soundexesque array (as a lookup / 'hash' table) - this will soon be a generic object due to using text indexes instead of numbers (as a javascript array should.) NB may change if this code ported.

	
	var numberRegex = /([0-9][\D]{0,20})/
	var numbersArray = strSoundexesque.split(numberRegex);	// split on (and capture) numeric characters (via reg ex)
	
	for (var inti = 0; inti < numbersArray.length; inti++)
	{
		if (numbersArray[inti].length == 0)	// if empty,  (regular axpression not crorect, grrr!)
		{
			numbersArray.splice(inti,1);	// remove
		}
	}
	
	// so split (to array)
	for (var numberCounter = 0;numberCounter < numbersArray.length;numberCounter++)// for every element in the array (i.e. every soundexesque value)	
	{
		var commasArray = numbersArray[numberCounter].split(',');		// split this on array further on commas
		var soundexesqueValue = commasArray[0];			// the first value in these arrays is the soundesque value
		for (var innerNumber = 1; innerNumber < commasArray.length; innerNumber++)
		{
			// for every element after the first (which contain the graphs to be assigned soundexesque values)
			soundexesqueAssociativeArray[commasArray[innerNumber]] = soundexesqueValue;	// define a value of the array/object, with the graph as the index and the soundexesque value (first element) as associated value
		}
	}	

	this.setSoundexesqueTable(soundexesqueAssociativeArray);	// read in Soundex-esque associative array / hash-table 
	
	// if referring to a ProsodicTextProcessor instance, set that instance's soundexesque array to be thus

}


ProsodicTextProcessor.prototype.soundexesqueAssign = function(sound)
{
	// function - assign a soundexesque value to a 
		
	
	// define full or near matches i/y, e/a
	
	// function - assigns Soundex-esque value string of digits to a sound
	// NB - only takes 1 sound at a time - to build a full soundexesque string, make repeated calls
	
	var soundexesqueTable = this.getSoundexesqueTable();
	var vowelsRegEx = this.getAllVowelsRegularExpression();		// get "all vowels" regular expression
	var soundexesqueMultiDigit = "";
	
	
	if (sound.match(vowelsRegEx) != null)		// if a vowel (single or multiple character)
	{
		return sound.toLowerCase();	// then return lower case of vowel
	}
	else
	{
		// else (must presumably be a consonant) look up the passed consonant argument
		// in case of multiple graph consonant, must compile each soundexesque digit & build string
		for (var intChar=0; intChar < sound.length; intChar++)
		{
			soundexesqueMultiDigit = soundexesqueMultiDigit + soundexesqueTable[sound.charAt(intChar)];	// compile its soundexesque value (may be more than 1 digit)
		}
		
		return soundexesqueMultiDigit;
	}
	
	
	
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
	
}		// end of soundexesqueAssign function


// NB need a method in ProsodicTextProcessor.prototype.getAllVowelsRegularExpression() .getAllConsonantsRegularExpression() 
// using  buildGraphsRegularExpression(1,double,2,3)  - 1 set up ready for vowels and 1 set up ready for consonants
// NB must ensure all that onset, nucleus and coda values for vowels are lower case


ProsodicTextProcessor.prototype.setSoundexesqueTable = function(soundexesqueTable)
{
	// sets a hash-table/associative array argument (array with strings for index) as PTP's list of Soundex-esque values
	this.soundexesqueTable = soundexesqueTable;	
}

ProsodicTextProcessor.prototype.getSoundexesqueTable = function()
{
	// returns a hash-table/associative array argument (array with strings for index), containing PTP's list of Soundex-esque values
	return this.soundexesqueTable;
}


ProsodicTextProcessor.prototype.soundexesqueComparison = function(soundexesqueA, soundexesqueB)
{
	// compare only 1 soundexesque value at a time
	// multiple comparisons (e.g. rhyme, where nucleus plus coda) must be done by repeated calls
	// if vowel passed in for comparison with consonant, match value will certainly be zero	
	// returns a value between 0 and 1, representing goodness of match

	var comparisonValue = 0;		// 0 = no match at all (default)
	
	var strPartialCompare = "";
	var vowelsRegEx = this.getAllVowelsRegularExpression();		// get "all vowels" regular expression
	
	
	if (soundexesqueA.match(vowelsRegEx) != null && soundexesqueB.match(vowelsRegEx) != null)		// if a vowel 			// if vowels
	{
		if (soundexesqueA.length == 1 && soundexesqueB.length == 1)		// if vowels both single graph,
		{
			if (soundexesqueA == soundexesqueB)			// and if vowel of syllable A is same as vowel of syllable B ...
			{
				comparisonValue = 1;		// ... then , full match (=1)
				// TODO:(some vowels can be allowed full or near match (e.g. Cornish i and y, or miscellaneous e and a))
			}
		}	// end of if vowel 1 character long
		else // else, if 1 or both vowels 2-graph
		{
			if (soundexesqueA == soundexesqueB)			// if vowel of syllable A is same as vowel of syllable B, full match (=1)
			{
				comparisonValue = 1;
			}
			else
			{			// else, if not full match, 
				var charA, charB;
				
				for (var charCounterA = 0; charCounterA < soundexesqueA.length; charCounterA++)	// for each character of A
				{
					for (var charCounterB = 0; charCounterB < soundexesqueB.length; charCounterB++)				// for every character of B
					{
							if (soundexesqueA.charAt(charCounterA) == soundexesqueB.charAt(charCounterB))	// compare - if match found one string within another...
							{
								comparisonValue = 0.5;		// ... then assign 50% match (partial vowel match)
							}
					}
				}	// end of for loop through characters of A
			}
		}	// end of > 1 vowel length else 

			
	}
	else			// else, if consonant
	{
		// else (must presumably be a consonant) look up the passed consonant argument
		if (soundexesqueA.length == 1 && soundexesqueB.length == 1)// if both consonants single graph (i.e. length: 1 soundexesque digit)
		{
			if (soundexesqueA == soundexesqueB)
			{
				comparisonValue = 1;		// and if soundexesque value of syllable A is same as vowel of syllable B, full match (=1)
			}
		}
		else			// else, if 1 or more consonants is multi-graph
		{
			if (soundexesqueA == soundexesqueB)		// if soundexesque digits A match soundexesque digits B ...
			{
				comparisonValue = 1;				// ... then, full match (=1)
			}
			else	// else, if not full match, (getting complicated now)
			{
				for (var partialCompareCounterA = 0; partialCompareCounterA < soundexesqueB.length -1; partialCompareCounterA++)	// shuffling along soundexesque A string,
				{
					strPartialCompare = soundexesqueA.substring(partialCompareCounterA,soundexesqueB.length -1);	//declare a temporary comparison variable string 1 digit shorter than full soundexesqueA
	
					if (soundexesqueB.match(strPartialCompare) != null)// and compare shorter string with full soundexesque B string  - if match found...
					{
						comparisonValue = 0.5;		// ... then assign 50% match (is this right?) (could be value based on length of string)
					}
					// TODO: this search could be cut down into still smaller substrings (presently compares n with n-1, so only 1 shuffle, 2 positions)
				}
				for (var partialCompareCounterB = 0; partialCompareCounterB < soundexesqueB.length -1; partialCompareCounterB++)	// shuffling along soundexesque B string,
				{
					strPartialCompare = soundexesqueB.substring(partialCompareCounterB,soundexesqueB.length -1);	// likewise, so as to be fair, for declare a temporary comparison variable string 1 digit shorter than full soundexesqueB 
				
					if (soundexesqueA.match(strPartialCompare) != null)// and compare shorter string with full soundesqueA string - if match found...
					{
						comparisonValue = 0.5;		// ... then assign 50% match (is this right?)
					}
				}
			}
		}	// end of multi-graph consonant else
		
	}	// end of consonant else clause

	

		
	// (normalised to 1)
	return comparisonValue;		// return value 0 = no match, 1 = full match, in between = nearlybout
	
	//TODO: could facilitate comparison of characters with accents, although this really intended for phonetic text
}		// end of soundexesqueComparison method


// delete below to 1654 if soundexesque within Syllable works ok
/*

ProsodicTextProcessor.prototype.alliterationCheck = function(syllableA, syllableB)
{
	// to compare initial alliteration, pass in first syllable of each
	// to compare stressed alliteration, pass in stressed syllable of each (loop through syllables until stressed == true)
	
	var onsetA = this.soundexesqueAssign(syllableA.getOnset());		// get soundexesque of syllable A onset		e.g. t of 'Tas', a of 'An', dh of 'dhe'n' 
	var onsetB = this.soundexesqueAssign(syllableB.getOnset());		// get soundexesque of syllable B onset
	var comparison = this.soundexesqueComparison(onsetA,onsetB);	// compare the values
	return comparison;			// return comparison value
}

ProsodicTextProcessor.prototype.consonanceCheck = function(syllableA, syllableB)
{
	// consonance - check consonant(s) (numeric) only  () - probably need to distinguish whether leading or trailing consonant (in case of CVC, or CV or VC), - 2 seprate checks - maybe allow different ends of syllable but higher value if same
	// number of results: CV vs CV/VC = 1, VC vs CVC = 2, CVC vs CVC = 4
	// returns n by 3 array where 1st sub-array contains comparison result, 2nd sub-array contains name of syllable A part, and 3rd sub-array contains name of syllable B part 

// should only return positive value for consonants	
	
	// if only wishing to test onset or coda edge of a syllable, may wish to instantiate and pass in otherwise-empty dummy / temporary syllable 
	// NB by default, does not test for consonance within a single syllable (eg dhodho,dhedhi) - could do (see above)
	
	var consonantRegEx = this.getAllConsonantsRegularExpression();
	var resultsArray = new Array();
	
	var syllableAArray = new Array();
	var syllableBArray = new Array();
	
	syllableAArray[0,0] = this.soundexesqueAssign(syllableA.getOnset());		// get soundexesque value of that part's consonant
	syllableAArray[0,1] = "Onset";
	syllableAArray[1,0] = this.soundexesqueAssign(syllableA.getNucleus());
	syllableAArray[1,1] = "Nucleus";
	syllableAArray[2,0] = this.soundexesqueAssign(syllableA.getCoda());
	syllableAArray[2,1] = "Coda";

	syllableBArray[0,0] = this.soundexesqueAssign(syllableB.getOnset());
	syllableBArray[0,1] = "Onset";
	syllableBArray[1,0] = this.soundexesqueAssign(syllableB.getNucleus());
	syllableBArray[1,1] = "Nucleus";
	syllableBArray[2,0] = this.soundexesqueAssign(syllableB.getCoda());
	syllableBArray[2,1] = "Coda";
	
	var comparisonValue = 0;

	
	// NB nucleus is never really consonant (whether CV, VC, CVC or V) - therefore really only need to compare syllable A's onset and nucleus)
	// ... so could do the below as Aonset vs Bonset, Aonset vs Bcoda, Acoda vs Bcoda
	
	
		comparisonValue = this.soundexesqueComparison(this.soundexesqueAssign(syllableA.getOnset()),this.soundexesqueAssign(syllableB.getOnset()));		// compare each consonant's soundexesque value with syllable B
		if (comparisonValue > 0 && syllableA.getOnset().match(consonantRegEx) != null)
			{
				resultsSubArray = new Array();		// declare sub-array to push onto results array later (NB javascript doesn't 'do' 2-dimensional arrays in same way as does C &c)
				resultsSubArray[0] = comparisonValue; 								
				resultsSubArray[1] = "Onset";
				resultsSubArray[2] = "Onset";
				resultsArray.push(resultsSubArray);		
			}

		comparisonValue = this.soundexesqueComparison(this.soundexesqueAssign(syllableA.getOnset()),this.soundexesqueAssign(syllableB.getCoda()));		// compare each consonant's soundexesque value with syllable B
		if (comparisonValue > 0 && syllableA.getNucleus().match(consonantRegEx) != null)
			{
				resultsSubArray = new Array();
				resultsSubArray[0] = comparisonValue; 								
				resultsSubArray[1] = "Onset";
				resultsSubArray[2] = "Coda";
				resultsArray.push(resultsSubArray);
			}

		comparisonValue = this.soundexesqueComparison(this.soundexesqueAssign(syllableA.getCoda()),this.soundexesqueAssign(syllableB.getCoda()));		// compare each consonant's soundexesque value with syllable B
		if (comparisonValue > 0 && syllableA.getCoda().match(consonantRegEx) != null)
			{
				resultsSubArray = new Array();
				resultsSubArray[0] = comparisonValue; 								
				resultsSubArray[1] = "Coda";
				resultsSubArray[2] = "Coda";
				resultsArray.push(resultsSubArray);
			}

*/
	 /*			
	
	for (var partCounterA = 0; partCounterA < 3; partCounterA++)	// for each part of syllable A	  
	{
		if (syllableAArray[partCounterA,0].match(consonantRegExp) != null) 		// if that part is a consonant
		{
			if (partCounterA > 0)		// check index above zero before -1 check
			{
				if (syllableAArray[partCounterA,0] != syllableAArray[partCounterA - 1,0])	// if that part is not the same as the previous part (? to avoid duplicates?)
				{
					for (var partCounterB = 0; partCounterB < 3; partCounterB++)	// for each part of syllable B
					{
						if (syllableBArray[partCounterB,0].match(consonantRegExp) != null) 		// if that part is a consonant
						{
							if (partCounterB > 0)		// check index above zero before -1 check
							{
								if (syllableBArray[partCounterB,0] != syllableBArray[partCounterB - 1,0])	// if that part is not the same as the previous part (? to avoid duplicates?)
								{
									comparisonValue = this.soundexesqueComparison(syllableAArray[partCounterA,0],syllableBArray[partCounterB,0]);		// compare each consonant's soundexesque value with syllable B
									if (comparisonValue > 0)
										{
											resultsArray[resultsArray.length,0] = comparisonValue; 		// push comparison value onto array , and ...					
											resultsArray[resultsArray.length,1] = syllableAArray[partCounterA,1];	// ... push name of part A into array ("onset"|nucleus|"coda")
											resultsArray[resultsArray.length,2] = syllableBArray[partCounterB,1];	// ... push name of part B into another array ("onset"|nucleus|"coda")											
										}									
									}	// end of check part B not same as previous part of syllable A									
								}	// end of checking part B is a consonant
						}		// end of syllable A for each part loop
				}	// end of check part A not same as previous part of syllable A
			}	// end of check index A above zero before -1 check
		// return array of comparison values and parts
		}	// end of checking part A is a consonant
	}	// end of syllable A for each part loop

// iterative version of consonance check

*/
/*
		return resultsArray;		// return array of arrays - may have n by 3 values, for n matches (up to 3 matches (see above)) 

}		// end of consonanceCheck function


ProsodicTextProcessor.prototype.assonanceCheck = function(syllableA, syllableB)
{
	// assonance - check vowel sound (alphabetic) only (vowelsRegEx?vowelsRegEx)
	// VC, CV, CVC, V - all have no more and no less than 1 vowel - 1 result returned
	// returns comparison value of vowels
	
	var vowelRegEx = this.getAllVowelsRegularExpression();	// obtain regular expression covering all vowels
	var assonanceA;
	var assonanceB;
	
	
	if(syllableA.getOnset().match(vowelRegEx) != null) 				// check syllable A's onset - if this a vowel, store and move on
	{
		assonanceA = this.soundexesqueAssign(syllableA.getOnset());
	}
	else if(syllableA.getNucleus().match(vowelRegEx) != null)		// else check syllable A's nucleus - if this a vowel, obtain vowel's soundexesque value, store and move on
	{
		assonanceA = this.soundexesqueAssign(syllableA.getNucleus());
	}
	else
	{
		assonanceA = this.soundexesqueAssign(syllableA.getCoda());	// else store syllable A's coda
	}

	if(syllableB.getOnset().match(vowelRegEx) != null) 				// check syllable B's onset - if this a vowel, store and move on
	{
		assonanceB = this.soundexesqueAssign(syllableB.getOnset());
	}
	else if(syllableB.getNucleus().match(vowelRegEx) != null)		// else check syllable B's nucleus - if this a vowel, obtain vowel's soundexesque value, store and move on
	{
		assonanceB = this.soundexesqueAssign(syllableB.getNucleus());
	}
	else
	{
		assonanceB = this.soundexesqueAssign(syllableB.getCoda());	// else store syllable B's coda
	}
	
	// has to be a vowel (and only 1 vowel!) in the syllable somewhere ?!
	
	var comparisonValue = this.soundexesqueComparison(assonanceA,assonanceB);		// compare soundexesque value of vowels of syllables A and B
	return comparisonValue;				// return result
	
}

ProsodicTextProcessor.prototype.rhymeCheck = function(syllableA, syllableB)
{
	// rhyme - check penultimate and final digits
	// the syllable's 'rime' is considered to be the nucleus plus the coda
	// returns 1 result of rhyme comparison between syllables

	
	var nucleusA = this.soundexesqueAssign(syllableA.getNucleus());			// get syllable A's nucleus, obtain its soundexesque value and store
	var codaA = this.soundexesqueAssign(syllableA.getCoda());				// get syllable A's coda, obtain its soundexesque value and store
	
	var nucleusB = this.soundexesqueAssign(syllableB.getNucleus());			// get syllable B's nucleus, obtain its soundexesque value and store
	var codaB = this.soundexesqueAssign(syllableB.getCoda());				// get syllable B's coda, obtain its soundexesque value and store
	
	var nucleusComparisonValue = this.soundexesqueComparison(nucleusA,nucleusB);	// compare soundexesque value of nucleus of syllables A and B
	var codaComparisonValue = this.soundexesqueComparison(codaA,codaB);		// compare soundexesque value of coda of syllables A and B
	
	var comparisonValue = (nucleusComparisonValue + codaComparisonValue)/2	// sum both comparisons and halve the total
	// i.e. the rhyme check is an average of the nucleus comparison and the coda comparison - a partial rhyme (e.g. rhyming nuclei but not codas) gives some result value - normalised to 1 for nearlybout perfect rhyme
	return comparisonValue;		// return result
}
*/


ProsodicTextProcessor.prototype.alliterationCheck = function(syllableA, syllableB)
{
	// to compare initial alliteration, pass in first syllable of each
	// TODO: to compare stressed alliteration, pass in stressed syllable of each (loop through syllables until stressed == true)
	
/////	var onsetA = this.soundexesqueAssign(syllableA.getOnset());		// get soundexesque of syllable A onset		e.g. t of 'Tas', a of 'An', dh of 'dhe'n' 
/////	var onsetB = this.soundexesqueAssign(syllableB.getOnset());		// get soundexesque of syllable B onset
/////	var comparison = this.soundexesqueComparison(onsetA,onsetB);	// compare the values
	var comparison = this.soundexesqueComparison(syllableA.getOnsetSoundexesque(),syllableB.getOnsetSoundexesque());	// compare the values
	return comparison;			// return comparison value
}

ProsodicTextProcessor.prototype.consonanceCheck = function(syllableA, syllableB)
{
	// consonance - check consonant(s) (numeric) only  () - probably need to distinguish whether leading or trailing consonant (in case of CVC, or CV or VC), - 2 separate checks - maybe allow different ends of syllable but higher value if same
	// number of results: CV vs CV/VC = 1, VC vs CVC = 2, CVC vs CVC = 3?4?
	// returns n by 3 array where 1st sub-array contains comparison result, 2nd sub-array contains name of syllable A part, and 3rd sub-array contains name of syllable B part 
	// n by 4? - would need to change prosodic link handling routine also
	
// should only return positive value for consonants	
	
	// if only wishing to test onset or coda edge of a syllable, may wish to instantiate and pass in otherwise-empty dummy / temporary syllable 
	// NB by default, does not test for consonance within a single syllable (eg dhodh|o,dhedh|i) as defined by these routines - could do (see above)
	// TODO: intra-syllable consonance check (onset-coda)
	
	var consonantRegEx = this.getAllConsonantsRegularExpression();
	var resultsArray = new Array();
	
	var syllableAArray = new Array();
	var syllableBArray = new Array();
	
/*
	syllableAArray[0,0] = this.soundexesqueAssign(syllableA.getOnset());		// get soundexesque value of that part's consonant
	syllableAArray[0,1] = "Onset";
	syllableAArray[1,0] = this.soundexesqueAssign(syllableA.getNucleus());
	syllableAArray[1,1] = "Nucleus";
	syllableAArray[2,0] = this.soundexesqueAssign(syllableA.getCoda());
	syllableAArray[2,1] = "Coda";

	syllableBArray[0,0] = this.soundexesqueAssign(syllableB.getOnset());
	syllableBArray[0,1] = "Onset";
	syllableBArray[1,0] = this.soundexesqueAssign(syllableB.getNucleus());
	syllableBArray[1,1] = "Nucleus";
	syllableBArray[2,0] = this.soundexesqueAssign(syllableB.getCoda());
	syllableBArray[2,1] = "Coda";
*/
	
	syllableAArray[0,0] = syllableA.getOnsetSoundexesque();		// get soundexesque value of that part's consonant
	syllableAArray[0,1] = "Onset";
	syllableAArray[1,0] = syllableA.getNucleusSoundexesque();
	syllableAArray[1,1] = "Nucleus";
	syllableAArray[2,0] = syllableA.getCodaSoundexesque();
	syllableAArray[2,1] = "Coda";

	syllableBArray[0,0] = syllableB.getOnsetSoundexesque();
	syllableBArray[0,1] = "Onset";
	syllableBArray[1,0] = syllableB.getNucleusSoundexesque();
	syllableBArray[1,1] = "Nucleus";
	syllableBArray[2,0] = syllableB.getCodaSoundexesque();
	syllableBArray[2,1] = "Coda";

	
	var comparisonValue = 0;

	
	// NB nucleus is never really consonant (whether CV, VC, CVC or V) - therefore really only need to compare syllable A's onset and nucleus)
	// ... so could do the below as Aonset vs Bonset, Aonset vs Bcoda, Acoda vs Bcoda
	
	
/////		comparisonValue = this.soundexesqueComparison(this.soundexesqueAssign(syllableA.getOnset()),this.soundexesqueAssign(syllableB.getOnset()));		// compare each consonant's soundexesque value with syllable B
	comparisonValue = this.soundexesqueComparison(syllableA.getOnsetSoundexesque(),syllableB.getOnsetSoundexesque());		// compare each consonant's soundexesque value with syllable B
		if (comparisonValue > 0 && syllableA.getOnset().match(consonantRegEx) != null)		
			{	// this one (onsetA-onsetB) is similar to alliteration
				resultsSubArray = new Array();		// declare sub-array to push onto results array later (NB javascript doesn't 'do' 2-dimensional arrays in same way as does C &c)
				resultsSubArray[0] = comparisonValue; 								
				resultsSubArray[1] = "Onset";
				resultsSubArray[2] = "Onset";
				resultsArray.push(resultsSubArray);		
			}

		/////comparisonValue = this.soundexesqueComparison(this.soundexesqueAssign(syllableA.getOnset()),this.soundexesqueAssign(syllableB.getCoda()));		// compare each consonant's soundexesque value with syllable B
		comparisonValue = this.soundexesqueComparison(syllableA.getOnsetSoundexesque(),syllableB.getCodaSoundexesque());		// compare each consonant's soundexesque value with syllable B
		if (comparisonValue > 0 && syllableA.getNucleus().match(consonantRegEx) != null)
			{
				resultsSubArray = new Array();
				resultsSubArray[0] = comparisonValue; 								
				resultsSubArray[1] = "Onset";
				resultsSubArray[2] = "Coda";
				resultsArray.push(resultsSubArray);
			}

		/////comparisonValue = this.soundexesqueComparison(this.soundexesqueAssign(syllableA.getCoda()),this.soundexesqueAssign(syllableB.getCoda()));		// compare each consonant's soundexesque value with syllable B
		comparisonValue = this.soundexesqueComparison(syllableA.getCodaSoundexesque(),syllableB.getCodaSoundexesque());		// compare each consonant's soundexesque value with syllable B
		if (comparisonValue > 0 && syllableA.getCoda().match(consonantRegEx) != null)
			{
				resultsSubArray = new Array();
				resultsSubArray[0] = comparisonValue; 								
				resultsSubArray[1] = "Coda";
				resultsSubArray[2] = "Coda";
				resultsArray.push(resultsSubArray);
			}

		comparisonValue = this.soundexesqueComparison(syllableA.getCodaSoundexesque(),syllableB.getOnsetSoundexesque());		// compare each consonant's soundexesque value with syllable B
		if (comparisonValue > 0 && syllableA.getCoda().match(consonantRegEx) != null)
			{
				resultsSubArray = new Array();
				resultsSubArray[0] = comparisonValue; 								
				resultsSubArray[1] = "Coda";
				resultsSubArray[2] = "Onset";
				resultsArray.push(resultsSubArray);
			}		
 

	 /*			
	
	for (var partCounterA = 0; partCounterA < 3; partCounterA++)	// for each part of syllable A	  
	{
		if (syllableAArray[partCounterA,0].match(consonantRegExp) != null) 		// if that part is a consonant
		{
			if (partCounterA > 0)		// check index above zero before -1 check
			{
				if (syllableAArray[partCounterA,0] != syllableAArray[partCounterA - 1,0])	// if that part is not the same as the previous part (? to avoid duplicates?)
				{
					for (var partCounterB = 0; partCounterB < 3; partCounterB++)	// for each part of syllable B
					{
						if (syllableBArray[partCounterB,0].match(consonantRegExp) != null) 		// if that part is a consonant
						{
							if (partCounterB > 0)		// check index above zero before -1 check
							{
								if (syllableBArray[partCounterB,0] != syllableBArray[partCounterB - 1,0])	// if that part is not the same as the previous part (? to avoid duplicates?)
								{
									comparisonValue = this.soundexesqueComparison(syllableAArray[partCounterA,0],syllableBArray[partCounterB,0]);		// compare each consonant's soundexesque value with syllable B
									if (comparisonValue > 0)
										{
											resultsArray[resultsArray.length,0] = comparisonValue; 		// push comparison value onto array , and ...					
											resultsArray[resultsArray.length,1] = syllableAArray[partCounterA,1];	// ... push name of part A into array ("onset"|nucleus|"coda")
											resultsArray[resultsArray.length,2] = syllableBArray[partCounterB,1];	// ... push name of part B into another array ("onset"|nucleus|"coda")											
										}									
									}	// end of check part B not same as previous part of syllable A									
								}	// end of checking part B is a consonant
						}		// end of syllable A for each part loop
				}	// end of check part A not same as previous part of syllable A
			}	// end of check index A above zero before -1 check
		// return array of comparison values and parts
		}	// end of checking part A is a consonant
	}	// end of syllable A for each part loop

// iterative version of consonance check

*/

		return resultsArray;		// return array of arrays - may have n by 3 values, for n matches (up to 3 matches (see above)) 

}		// end of consonanceCheck function


ProsodicTextProcessor.prototype.assonanceCheck = function(syllableA, syllableB)
{
	// assonance - check vowel sound (alphabetic) only (vowelsRegEx?vowelsRegEx)
	// VC, CV, CVC, V - all have no more and no less than 1 vowel - 1 result returned
	// returns comparison value of vowels
	
	var vowelRegEx = this.getAllVowelsRegularExpression();	// obtain regular expression covering all vowels
	var assonanceA;
	var assonanceB;
	
	
	if(syllableA.getOnset().match(vowelRegEx) != null) 				// check syllable A's onset - if this a vowel, store and move on
	{
		/////assonanceA = this.soundexesqueAssign(syllableA.getOnset());
		assonanceA = syllableA.getOnsetSoundexesque();
	}
	else if(syllableA.getNucleus().match(vowelRegEx) != null)		// else check syllable A's nucleus - if this a vowel, obtain vowel's soundexesque value, store and move on
	{
		/////assonanceA = this.soundexesqueAssign(syllableA.getNucleus());
		assonanceA = syllableA.getNucleusSoundexesque();
	}
	else	// would this ever occur - i.e. vowel at coda only?
	{
		/////assonanceA = this.soundexesqueAssign(syllableA.getCoda());	// else store syllable A's coda
		assonanceA = syllableA.getCodaSoundexesque();	// else store syllable A's coda
	}

	if(syllableB.getOnset().match(vowelRegEx) != null) 				// check syllable B's onset - if this a vowel, store and move on
	{
		/////assonanceB = this.soundexesqueAssign(syllableB.getOnset());
		assonanceB = syllableB.getOnsetSoundexesque();
	}
	else if(syllableB.getNucleus().match(vowelRegEx) != null)		// else check syllable B's nucleus - if this a vowel, obtain vowel's soundexesque value, store and move on
	{
		/////assonanceB = this.soundexesqueAssign(syllableB.getNucleus());
		assonanceB = syllableB.getNucleusSoundexesque();
	}
	else
	{
		/////assonanceB = this.soundexesqueAssign(syllableB.getCoda());	// else store syllable B's coda
		assonanceB = syllableB.getCodaSoundexesque();	// else store syllable B's coda
	}
	
	// has to be a vowel (and only 1 vowel!) in the syllable somewhere ?!
	
	var comparisonValue = this.soundexesqueComparison(assonanceA,assonanceB);		// compare soundexesque value of vowels of syllables A and B
	return comparisonValue;				// return result
	
}

ProsodicTextProcessor.prototype.rhymeCheck = function(syllableA, syllableB)
{
	// rhyme - check penultimate and final digits
	// the syllable's 'rime' is considered to be the nucleus plus the coda
	// returns 1 result of rhyme comparison between syllables

/*	
	var nucleusA = this.soundexesqueAssign(syllableA.getNucleus());			// get syllable A's nucleus, obtain its soundexesque value and store
	var codaA = this.soundexesqueAssign(syllableA.getCoda());				// get syllable A's coda, obtain its soundexesque value and store
	
	var nucleusB = this.soundexesqueAssign(syllableB.getNucleus());			// get syllable B's nucleus, obtain its soundexesque value and store
	var codaB = this.soundexesqueAssign(syllableB.getCoda());				// get syllable B's coda, obtain its soundexesque value and store
*/	

	var nucleusA = syllableA.getNucleusSoundexesque();			// get syllable A's nucleus, obtain its soundexesque value and store
	var codaA = syllableA.getCodaSoundexesque();				// get syllable A's coda, obtain its soundexesque value and store
	
	var nucleusB = syllableB.getNucleusSoundexesque();			// get syllable B's nucleus, obtain its soundexesque value and store
	var codaB = syllableB.getCodaSoundexesque();				// get syllable B's coda, obtain its soundexesque value and store
	
	var nucleusComparisonValue = this.soundexesqueComparison(nucleusA,nucleusB);	// compare soundexesque value of nucleus of syllables A and B
	var codaComparisonValue = this.soundexesqueComparison(codaA,codaB);		// compare soundexesque value of coda of syllables A and B
	
	var comparisonValue = (nucleusComparisonValue + codaComparisonValue)/2	// sum both comparisons and halve the total
	// i.e. the rhyme check is an average of the nucleus comparison and the coda comparison - a partial rhyme (e.g. rhyming nuclei but not codas) gives some result value - normalised to 1 for nearlybout perfect rhyme
	return comparisonValue;		// return result
}



//ProsodicTextDocument.prototype.compileProsodicTextLine = function (syllablesLine)		//??
ProsodicTextProcessor.prototype.compileProsodicTextLine = function (syllablesLine, lineNumber)
{
	// function - compiles a line of prosodic terms,
	// argument/parameter - an array of syllable objects (these probably best obtained through DisplayText.getLineByNumber(number), and then getSyllables() for each VocalicText element)
	// or else obtained as ProsodicLine object of ProsodicDocumentText.lines 
	
	// should populate the lines property of a ProsodicTextDocument - this data would then be referred to 

	// for each syllable in the line of syllables passed
	// ...? make this a
	
	this.lengthsOfWords = new Array();	// array holding values which specify lengths of words in syllables e.g. An Tas a Nev y'm gelwir = 1,1,1,1,1,2; Formyer puptra a vydh gwrys = 2,2,1,1,1 - obtained using counter while reading syllables from VocalicText objects
	//this.lineNumberInStanza = 0;		// line number within its stanza
	//this.lineNumberInTotal = 0;		// line number within all lines of the text
	//this.stanzaNumber = 0;			// the number of the stanza within which this line d'appear
	// cf ProsodicTextDocument, ProsodicTextLine
	
	// might need a function for lines too short (hypometric) or too long (hypermetric) if processing using aggregated standard-sized matrices
}

ProsodicTextProcessor.prototype.standardProsodicHarmonyTestsOn2Syllables = function(syllableA, syllableB)
{
	// perform for each syllable in this line
	// telling the machine a story
	
	var comparisonResult = 0;
	var links = new Array();	// array to hold results, for returning
//console.log(syllableA.getText(),syllableB.getText());
	// for each syllable in the line (except this one)
	comparisonResult = this.alliterationCheck(syllableA, syllableB);	// compare this syllable with that syllable for alliteration
	if (comparisonResult > 0)	//(if a positive result, store as a prosodic harmony link)
	{
		links[links.length] = new ProsodicVector (syllableA, syllableB, "alliteration",comparisonResult);
	}
	
	comparisonResult = this.assonanceCheck(syllableA, syllableB);	// compare this syllable with that syllable for assonance
	if (comparisonResult > 0)	//(if a positive result, store as a prosodic harmony link)
	{
		links[links.length] = new ProsodicVector (syllableA, syllableB, "assonance",comparisonResult);
	}

	comparisonResult = this.consonanceCheck(syllableA, syllableB);	// compare this syllable with that syllable for consonance
	if (comparisonResult.length > 0)	//(if a positive result, store as a prosodic harmony link)
	{
		for (var consonanceResult = 0; consonanceResult < comparisonResult.length;consonanceResult++)	// loop through length of consonance comparison's results array (1 result in this array per consonance found between syllables - could be up to 3?)
		{
			var poppedConsonanceResult = comparisonResult.pop();	// pop the consonance result array [value, syllable A part, syllable B part] for as many as there are results
			/*	
			links[links.length] = new ProsodicVector(syllableA, syllableB, "consonance",comparisonResult[consonanceResult,0]);
			links[links.length-1].setSyllableALinkInfo(comparisonResult[consonanceResult,1]);
			links[links.length-1].setSyllableBLinkInfo(comparisonResult[consonanceResult,2]);
			*/
			links[links.length] = new ProsodicVector(syllableA, syllableB, "consonance",poppedConsonanceResult[0]);		// retrieve value from 1st element of consonance result array
			links[links.length-1].setSyllableALinkInfo(poppedConsonanceResult[1]);		// retrieve syllable A's part from 2nd element of consonance result array
			links[links.length-1].setSyllableBLinkInfo(poppedConsonanceResult[2]);		// retrieve syllable B's part from 3rd element of consonance result array			
		}
	}

	comparisonResult = this.rhymeCheck(syllableA, syllableB);	// compare this syllable with that syllable for rhyme
	if (comparisonResult > 0)	//(if a positive result, store as a prosodic harmony link)
	{
		links[links.length] = new ProsodicVector (syllableA, syllableB, "rhyme",comparisonResult);
	}
		
	return links;	// return array of results, as prosodic harmony link vectors, if any found between these 2 syllables
	
}	// end of standardProsodicHarmonyTestsOn2Syllables method


ProsodicTextProcessor.prototype.prosodicCheckOnProsodicLine = function (prosodicTextLine, thisSyllable, thisSyllableIndexWithinLine)
{
	// function - a method to check a whole prosodic text line with prosodic harmony tests
	// parameter/argument (note to self:check which!) - a prosodic line, ie an array of Syllable objects
	// thisSyllable: argument unused if comparing within line /intra-linear (see below), must be instance of the syllable-of-interest if inter-linear / between lines comparison (safest to always pass in syllable of interest) NB syllable-of-interest, as object argument/parameter, in javascript retains changes made in function 
	// thisSyllableIndexWithinLine: supply -1 as value if comparing entirety of another line (NB the code takes care if arguments supplied thus) 

	// counts up from (rightward) only in line, never backward (to the left), to compare syllables
	
	// NB could supply impossibly high number for thisSyllableIndex, in order to check every syllable on line (could hard code a value e.g. 999 in logic)
	// TODO: optional arguments in javascript functions ?
	
	// returns array of strings for all prosodic vectors in this line (CSV - x,y,type,value)
	
	var links = new Array();		// will be array of ProsodicLink/ProsodicVector objects

	var lineLinks = new Array();	// [] an array of all prosodic link vector strings for this prosodic line (for this particular syllable-of-interest) 
	
	var linkType = "";
	var xOffset, yOffset, value = 0;
	
	var syllableOfInterest = thisSyllable;		// by default, set to whatever is passed in as syllable
	
	if (thisSyllableIndexWithinLine != -1)		// if syllable-of-interest not actually from this line (i.e. checking lines below (or above))
	{
		syllableOfInterest = prosodicTextLine.getSyllableByNumber(thisSyllableIndexWithinLine);	// if comparing intra-line, get syllable-of-interest
	}
	
	for (var syllableCounter = thisSyllableIndexWithinLine +1; syllableCounter < prosodicTextLine.getSyllables().length; syllableCounter++)	// for every element/syllable after the comparison syllable in this prosodic line
	{
		//alert('got here3 - syllable / prosodic line number' + thisSyllableIndexWithinLine + '/' + syllableCounter + '/' + prosodicTextLine.getLineNumber());	//NB should be getLineNumberWithinTotal
//debugger;			
		links = this.standardProsodicHarmonyTestsOn2Syllables(syllableOfInterest,prosodicTextLine.getSyllableByNumber(syllableCounter));		// perform standard prosodic harmony comparison tests on the 2 syllables
		
		lineLinks = lineLinks.concat(links);	// concatnate these links to running array of links for all syllables in prosodic line (for this particular syllable-of-interest)
		
			// need to use returned links (if any) between syllables
		for (var intLinkCounter = 0; intLinkCounter < links.length; intLinkCounter++)	// for each link object *for this pair of syllables*
		{
			xOffset = (syllableCounter - syllableOfInterest.getSyllableNumber());						// calculate relevant vector values
			yOffset = (prosodicTextLine.getLineNumberWithinTotal() - syllableOfInterest.getProsodicLineNumber());
			linkType = links[intLinkCounter].getLinkType();
			value = links[intLinkCounter].getValue();
			
			// may wish to add further data passing (e.g. consonance comparison details)
			
			syllableOfInterest.pushToVectorOriginStrings(xOffset + "," + yOffset + "," + linkType + "," + value);	//xOffset,yOffset,type,value-> string ... and set vector coordinate data on Syllable (whether in this line or not) (by data within array of strings)...
			prosodicTextLine.getSyllableByNumber(syllableCounter).pushToVectorDestinationStrings(-xOffset + "," + -yOffset + "," + linkType + "," + value);	//xOffset,yOffset,type,value-> string ... and set vector coordinate data on Syllable (whether in this line or not) (by data within array of strings)...
			
			links[intLinkCounter].setXOffset(xOffset);		// ... and set vector coordinate data on ProsodicVector...
			links[intLinkCounter].setYOffset(yOffset);		// ... and again set vector coordinate data on ProsodicVector...
			
			prosodicTextLine.getProsodicTextDocument().pushProsodicVector(links[intLinkCounter]);	// add this ProsodicVector object (prosodic harmony links) to ProsodicTextDocument
			syllableOfInterest.pushProsodicVector(links[intLinkCounter]);		// also add this ProsodicVector object (prosodic harmony links) to both origin (earlier) and destination (later) syllables 
			prosodicTextLine.getSyllableByNumber(syllableCounter).pushProsodicVector(links[intLinkCounter]);		// ... ditto
			
			
		}	// end of for every link (prosodic vector) found between this pair of syllables
		
	}	// end of for every syllable in this line, after syllable-of-interest
		
	return lineLinks;	// array of strings describing all prosodic harmony links from this line (for this particular syllable-of-interest)
	
	// TODO: check that this link not already established ? (may be ensured by rightward/downward only checks)		
}		// end of prosodicCheckOnProsodicLine method





function ProsodicTextDocument ()
{
	this.lines = new Array();	//collection of all lines
	// perhaps prosodic harmony links/vectors should be stored here
	
	// ProsodicTextProcessor.prototype.compileProsodicTextLine can populate the lines
	
	this.prosodicVectors = new Array();
	
	// also maybe eventually stanza data
	
}

ProsodicTextDocument.prototype.setLines = function(prosodicTextLinesArray)
{
	this.lines = prosodicTextLinesArray;
}

ProsodicTextDocument.prototype.getLines = function()
{
	return this.lines;
}

ProsodicTextDocument.prototype.setProsodicLineByNumber = function(intIndex, prosodicTextLine)	// zero-indexed
{
	this.lines[intIndex] = prosodicTextLine;
}

ProsodicTextDocument.prototype.getProsodicLineByNumber = function(intIndex)		// zero-indexed
{
	return this.lines[intIndex];
}


ProsodicTextDocument.prototype.pushLine = function(prosodicTextLine)
{
	this.lines.push(prosodicTextLine);
	return prosodicTextLine;
}

ProsodicTextDocument.prototype.getProsodicVectors = function()
{
	return this.prosodicVectors;
}

ProsodicTextDocument.prototype.setProsodicVectorByNumber = function(intIndex, prosodicVector)	// zero-indexed
{
	this.prosodicVectors[intIndex] = prosodicVector;
}

ProsodicTextDocument.prototype.getProsodicVectorByNumber = function(intIndex)		// zero-indexed
{
	return this.prosodicVectors[intIndex];
}


ProsodicTextDocument.prototype.pushProsodicVector = function(prosodicVector)
{
	this.prosodicVectors.push(prosodicVector);
	return prosodicVector;
}

ProsodicTextDocument.prototype.bulkProsodicDocumentProsodicChecks = function(prosodicTextProcessor)
{
	// function - perform bulkProsodicChecks on every Prosodic Text Line within this ProsodicTextDocument
	// result - builds up ProsodicVector objects (from prosodic harmony checks) and populates prosodic vector string data in Syllable objects' vector string properties
		
	for (var lineCounter = 0; lineCounter < this.getLines().length; lineCounter++)		// for every prosodic line in prosodic text document 
	{//console.log('lineCounter ' + lineCounter + ' total vectors = ' + this.getProsodicVectors().length);
		this.getProsodicLineByNumber(lineCounter).bulkProsodicLineProsodicChecks(prosodicTextProcessor);						// perform standard prosodic checks (and calculate & record prosodic harmony data)
		this.getProsodicLineByNumber(lineCounter).setStatistics(prosodicTextProcessor.calculateProsodicVectorStatistics(this.getProsodicLineByNumber(lineCounter).getVectorOriginStringsOfAllSyllables() ));	// while we're on the subject, let's also use the newly obtained prosodic vectors to compile statistics for each line
	}
	

	
}		// end of bulkProsodicDocumentChecks method



ProsodicTextProcessor.prototype.calculateProsodicVectorStatistics = function(vectorStrings)
{
	// function - calculates basic stats from a string of CSV strings describing prosodic harmony links/vectors  
	// CSV - x,y,type,value
	// vectorStrings - array of prosodic vector strings (see above)
	// NB all values supplied in strings are literals, calculated one-off and subject to variables such as number of lines searched below, &c
	// could be used on a per-syllable, or per-line, or per-document basis - or even per-corpus
	// default application to Syllable objects, using ProsodicTextLine.prototype.getVectorOriginStringsOfAllSyllables() or Syllable.prototype.getVectorOriginStrings()
	
//	var allVectorStrings = this.getVectorStringsOfAllSyllables();		// fetch an array of vector strings computed for all syllables in this prosodic line
	var allVectorStrings = vectorStrings; 
	var countRhyme = 0,sumRhymeValue = 0,meanRhymeValue = 0,sumRhymeX = 0,meanRhymeX = 0,sumRhymeY = 0,meanRhymeY = 0,stdevRhymeValue = 0,stdevRhymeX = 0,stdevRhymeY = 0;
	var countAlliteration = 0,sumAlliterationValue = 0,meanAlliterationValue = 0,sumAlliterationX = 0,meanAlliterationX = 0,sumAlliterationY = 0,meanAlliterationY = 0,stdevAlliterationValue = 0,stdevAlliterationX = 0,stdevAliterationY = 0;
	var countAssonance = 0,sumAssonanceValue = 0,meanAssonanceValue = 0,sumAssonanceX = 0,meanAssonanceX = 0,sumAssonanceY = 0,meanAssonanceY = 0,stdevAssonanceValue = 0,stdevAssonanceX = 0,stdevAssonanceY = 0
	var countConsonance = 0,sumConsonanceValue = 0,meanConsonanceValue = 0,sumConsonanceX = 0,meanConsonanceX = 0,sumConsonanceY = 0,meanConsonanceY = 0,stdevConsonanceValue = 0,stdevConsonanceX = 0,stdevConsonanceY = 0;
	var	countOther = 0,sumOtherValue = 0,meanOtherValue = 0,sumOtherX = 0,meanOtherX = 0,sumOtherY = 0,meanOtherY = 0,stdevOtherValue = 0,stdevOtherX = 0,stdevOtherY = 0;		// if there are other values, i.e. not covered by basic prosodic harmony check types (rhyme, alliteration, assonance, consonance), then something is messed up!
	var sumValue = 0,meanValue = 0;
	var sumX = 0,meanX = 0;
	var sumY = 0,meanY = 0;
	
//	countRhyme,sumRhymeValue,meanRhymeValue,sumRhymeX,meanRhymeX,sumRhymeY,meanRhymeY,stdevRhymeValue,stdevRhymeX,stdevRhymeY,countAlliteration,sumAlliterationValue,meanAlliterationValue,sumAlliterationX,meanAlliterationX,sumAlliterationY,meanAlliterationY,stdevAlliterationValue,stdevAlliterationX,stdevAliterationY,countAssonance,sumAssonanceValue,meanAssonanceValue,sumAssonanceX,meanAssonanceX,sumAssonanceY,meanAssonanceY,stdevAssonanceValue,stdevAssonanceX,stdevAssonanceY,countConsonance,sumConsonanceValue,meanConsonanceValue,sumConsonanceX,meanConsonanceX,sumConsonanceY,meanConsonanceY,stdevConsonanceValue,stdevConsonanceX,stdevConsonanceY,countOther,sumOtherValue,meanOtherValue,sumOtherX,meanOtherX,sumOtherY,meanOtherY,sumValue,meanValue,sumX,meanX,sumY,meanY
	
	for (i=0; i < allVectorStrings.length; i++)
	{
		var vectorStringSplit = allVectorStrings[i].split(/,/g);	// split CSV vector strings into n x 4 array
		
		switch(vectorStringSplit[2])	// test 'type' field of vector CSV string
		{
		case 'rhyme':
			countRhyme++;									// increment counter
			sumRhymeX = Number(vectorStringSplit[0]);				// update sum of x offsets for this type
			sumRhymeY = Number(vectorStringSplit[1]);				// update sum of y offsets for this type
			sumRhymeValue += Number(vectorStringSplit[3]);			// update sum of prosodic link value (strength) for this type
			stdevRhymeValue = Number(vectorStringSplit[3]) * Number(vectorStringSplit[3]);	// keep a running total of value squared in standard deviation variable, for now (use in calculation later) 
			stdevRhymeX = Number(vectorStringSplit[0]) * Number(vectorStringSplit[0]);		// keep a running total of x offset, squared
			stdevRhymeY = Number(vectorStringSplit[1]) * Number(vectorStringSplit[1]);		// keep a running total of y offset, squared
			break;
		case 'alliteration':
			countAlliteration++;							// increment counter
			sumAlliterationX = Number(vectorStringSplit[0]);		// update sum of x offsets for this type
			sumAlliterationY = Number(vectorStringSplit[1]);		// update sum of y offsets for this type
			sumAlliterationValue += Number(vectorStringSplit[3]);	// update sum of prosodic link value (strength)
			stdevAlliterationValue = Number(vectorStringSplit[3]) * Number(vectorStringSplit[3]);	// keep a running total of value squared in standard deviation variable, for now (use in calculation later) 
			stdevAlliterationX = Number(vectorStringSplit[0]) * Number(vectorStringSplit[0]);		// keep a running total of x offset, squared
			stdevAlliterationY = Number(vectorStringSplit[1]) * Number(vectorStringSplit[1]);		// keep a running total of y offset, squared
			break;
		case 'assonance':
			countAssonance++;								// increment counter
			sumAssonanceX = Number(vectorStringSplit[0]);			// update sum of x offsets for this type
			sumAssonanceY = Number(vectorStringSplit[1]);			// update sum of y offsets for this type
			sumAssonanceValue += Number(vectorStringSplit[3]);		// update sum of prosodic link value (strength)
			stdevAssonanceValue = Number(vectorStringSplit[3]) * Number(vectorStringSplit[3]);	// keep a running total of value squared in standard deviation variable, for now (use in calculation later) 
  			stdevAssonanceX = Number(vectorStringSplit[0]) * Number(vectorStringSplit[0]);		// keep a running total of x offset, squared
  			stdevAssonanceY = Number(vectorStringSplit[1]) * Number(vectorStringSplit[1]);		// keep a running total of y offset, squared
			break;
		case 'consonance':
			countConsonance++;								// increment counter
			sumConsonanceX = Number(vectorStringSplit[0]);			// update sum of x offsets for this type
			sumConsonanceY = Number(vectorStringSplit[1]);			// update sum of y offsets for this type
			sumConsonanceValue += Number(vectorStringSplit[3]);		// update sum of prosodic link value (strength)
			stdevConsonanceValue = Number(vectorStringSplit[3]) * Number(vectorStringSplit[3]);	// keep a running total of value squared in standard deviation variable, for now (use in calculation later) 
  			stdevConsonanceX = Number(vectorStringSplit[0]) * Number(vectorStringSplit[0]);		// keep a running total of x offset, squared
  			stdevConsonanceY = Number(vectorStringSplit[1]) * Number(vectorStringSplit[1]);		// keep a running total of y offset, squared
			break;
			default :								// in case prosodic link type recorded as not one of above
			countOther++;							// increment counter
			sumOtherX = Number(vectorStringSplit[0]);			// update sum of x offsets for this type
			sumOtherY = Number(vectorStringSplit[1]);			// update sum of y offsets for this type
			sumOtherValue += Number(vectorStringSplit[3]);	// update sum of prosodic link value (strength)
			stdevOtherValue = Number(vectorStringSplit[3]) * Number(vectorStringSplit[3]);	// keep a running total of value squared in standard deviation variable, for now (use in calculation later) 
  			stdevOtherX = Number(vectorStringSplit[0]) * Number(vectorStringSplit[0]);		// keep a running total of x offset, squared
  			stdevOtherY = Number(vectorStringSplit[1]) * Number(vectorStringSplit[1]);		// keep a running total of y offset, squared
		}
	}	// end of for-every-vector-string loop
	
	
	// calculate the mean for each type
	
	if (countRhyme > 0)
	{
		meanRhymeValue = sumRhymeValue / countRhyme;
		meanRhymeX = sumRhymeX / countRhyme;
		meanRhymeY = sumRhymeY / countRhyme;
	}
	if (countAlliteration > 0)
	{
		meanAlliterationValue = sumAlliterationValue / countAlliteration;
		meanAlliterationX = sumAlliterationX / countAlliteration;
		meanAlliterationY = sumAlliterationY / countAlliteration;
	}
	if (countAssonance > 0)
	{
		meanAssonanceValue = sumAssonanceValue / countAssonance;
		meanAssonanceX = sumAssonanceX / countAssonance;
		meanAssonanceY = sumAssonanceY / countAssonance;
	}
	if (countConsonance > 0)
	{
		meanConsonanceValue = sumConsonanceValue / countConsonance;
		meanConsonanceX = sumConsonanceX / countConsonance;
		meanConsonanceY = sumConsonanceY / countConsonance;
	}
	if (countOther > 0)
	{
		meanOtherValue = sumOtherValue / countOther;
		meanOtherX = sumOtherX / countOther;
		meanOtherY = sumOtherY / countOther;
	}
	
	// now that we know the mean, calculate the standard deviation 
	// standard deviation?  for loop sqrt ( (((value-meanvalue)^2)/count) ) or sqrt( (sum( sample^2) / N) - mean^2  )	
	// stdev variable actually presently holding sum of (samples squared)

	// Math.abs ?
	
	// toFixed(2)
	
	
	stdevRhymeValue = Math.sqrt((stdevRhymeValue / countRhyme) - (meanRhymeValue * meanRhymeValue));
	stdevRhymeX = Math.sqrt((stdevRhymeX / countRhyme) - (meanRhymeX * meanRhymeX));
	stdevRhymeY = Math.sqrt((stdevRhymeY / countRhyme) - (meanRhymeY * meanRhymeY));

	stdevAlliterationValue = Math.sqrt((stdevAlliterationValue / countAlliteration) - (meanAlliterationValue * meanAlliterationValue));
	stdevAlliterationX = Math.sqrt((stdevAlliterationX / countAlliteration) - (meanAlliterationX * meanAlliterationX));
	stdevAlliterationY = Math.sqrt((stdevAlliterationY / countAlliteration) - (meanAlliterationY * meanAlliterationY));
	
	stdevAssonanceValue = Math.sqrt((stdevAssonanceValue / countAssonance) - (meanAssonanceValue * meanAssonanceValue));
	stdevAssonanceX = Math.sqrt((stdevAssonanceX / countAssonance) - (meanAssonanceX * meanAssonanceX));
	stdevAssonanceY = Math.sqrt((stdevAssonanceY / countAssonance) - (meanAssonanceY * meanAssonanceY));
	
	stdevConsonanceValue = Math.sqrt((stdevConsonanceValue / countConsonance) - (meanConsonanceValue * meanConsonanceValue));
	stdevConsonanceX = Math.sqrt((stdevConsonanceX / countConsonance) - (meanConsonanceX * meanConsonanceX));
	stdevConsonanceY = Math.sqrt((stdevConsonanceY / countConsonance) - (meanConsonanceY * meanConsonanceY));
	
	stdevOtherValue = Math.sqrt((stdevOtherValue / countOther) - (meanOtherValue * meanOtherValue));
	stdevOtherX = Math.sqrt((stdevOtherX / countOther) - (meanOtherX * meanOtherX));
	stdevOtherY = Math.sqrt((stdevOtherY / countOther) - (meanOtherY * meanOtherY));
			
	// returns - ????? ProsodicStatistics object
	
	sumValue = (sumRhymeValue + sumAlliterationValue + sumAssonanceValue + sumConsonanceValue + sumRhymeValue);
	sumX = (sumRhymeX + sumAlliterationX + sumAssonanceX + sumConsonanceX + sumRhymeX);
	sumY = (sumRhymeY + sumAlliterationY + sumAssonanceY + sumConsonanceY + sumRhymeY);
	
	meanValue = (meanRhymeValue + meanAlliterationValue + meanAssonanceValue + meanConsonanceValue + meanOtherValue) / 5;
	meanX = (meanRhymeX + meanAlliterationX + meanAssonanceX + meanConsonanceX + meanOtherX) / 5;
	meanY = (meanRhymeY + meanAlliterationY + meanAssonanceY + meanConsonanceY + meanOtherY) / 5;
	
	return new ProsodicStatistics(countRhyme,sumRhymeValue,meanRhymeValue,sumRhymeX,meanRhymeX,sumRhymeY,meanRhymeY,stdevRhymeValue,stdevRhymeX,stdevRhymeY,countAlliteration,sumAlliterationValue,meanAlliterationValue,sumAlliterationX,meanAlliterationX,sumAlliterationY,meanAlliterationY,stdevAlliterationValue,stdevAlliterationX,stdevAliterationY,countAssonance,sumAssonanceValue,meanAssonanceValue,sumAssonanceX,meanAssonanceX,sumAssonanceY,meanAssonanceY,stdevAssonanceValue,stdevAssonanceX,stdevAssonanceY,countConsonance,sumConsonanceValue,meanConsonanceValue,sumConsonanceX,meanConsonanceX,sumConsonanceY,meanConsonanceY,stdevConsonanceValue,stdevConsonanceX,stdevConsonanceY,countOther,sumOtherValue,meanOtherValue,sumOtherX,meanOtherX,sumOtherY,meanOtherY,sumValue,meanValue,sumX,meanX,sumY,meanY);	
		
}


ProsodicStatistics = function(countRhyme,sumRhymeValue,meanRhymeValue,sumRhymeX,meanRhymeX,sumRhymeY,meanRhymeY,stdevRhymeValue,stdevRhymeX,stdevRhymeY,countAlliteration,sumAlliterationValue,meanAlliterationValue,sumAlliterationX,meanAlliterationX,sumAlliterationY,meanAlliterationY,stdevAlliterationValue,stdevAlliterationX,stdevAliterationY,countAssonance,sumAssonanceValue,meanAssonanceValue,sumAssonanceX,meanAssonanceX,sumAssonanceY,meanAssonanceY,stdevAssonanceValue,stdevAssonanceX,stdevAssonanceY,countConsonance,sumConsonanceValue,meanConsonanceValue,sumConsonanceX,meanConsonanceX,sumConsonanceY,meanConsonanceY,stdevConsonanceValue,stdevConsonanceX,stdevConsonanceY,countOther,sumOtherValue,meanOtherValue,sumOtherX,meanOtherX,sumOtherY,meanOtherY,sumValue,meanValue,sumX,meanX,sumY,meanY)
{	
		
	this.countRhyme = countRhyme;
	this.sumRhymeValue = sumRhymeValue;
	this.meanRhymeValue = meanRhymeValue;	
	this.sumRhymeX = sumRhymeX;	
	this.meanRhymeX = meanRhymeX;
	this.sumRhymeY = sumRhymeY;	
	this.meanRhymeY = meanRhymeY;
	this.stdevRhymeValue = stdevRhymeValue;
	this.stdevRhymeX = stdevRhymeX;
	this.stdevRhymeY = stdevRhymeY;
	this.countAlliteration = countAlliteration;
	this.sumAlliterationValue = sumAlliterationValue;
	this.meanAlliterationValue = meanAlliterationValue;
	this.sumAlliterationX = sumAlliterationX;
	this.meanAlliterationX = meanAlliterationX;
	this.sumAlliterationY = sumAlliterationY;
	this.meanAlliterationY = meanAlliterationY;
	this.stdevAlliterationValue = stdevAlliterationValue;
	this.stdevAlliterationX = stdevAlliterationX;
	this.stdevAliterationY = stdevAliterationY;
	this.countAssonance = countAssonance;
	this.sumAssonanceValue = sumAssonanceValue;
	this.meanAssonanceValue = meanAssonanceValue;
	this.sumAssonanceX = sumAssonanceX;
	this.meanAssonanceX = meanAssonanceX;
	this.sumAssonanceY = sumAssonanceY;
	this.meanAssonanceY = meanAssonanceY;
	this.stdevAssonanceValue = stdevAssonanceValue;
	this.stdevAssonanceX = stdevAssonanceX;
	this.stdevAssonanceY = stdevAssonanceY;
	this.countConsonance = countConsonance;
	this.sumConsonanceValue = sumConsonanceValue;
	this.meanConsonanceValue = meanConsonanceValue;
	this.sumConsonanceX = sumConsonanceX;
	this.meanConsonanceX = meanConsonanceX;
	this.sumConsonanceY = sumConsonanceY;
	this.meanConsonanceY = meanConsonanceY;
	this.stdevConsonanceValue = stdevConsonanceValue;
	this.stdevConsonanceX = stdevConsonanceX;
	this.stdevConsonanceY = stdevConsonanceY;
	this.countOther = countOther;
	this.sumOtherValue = sumOtherValue;
	this.meanOtherValue = meanOtherValue;
	this.sumOtherX = sumOtherX;
	this.meanOtherX = meanOtherX;
	this.sumOtherY = sumOtherY;
	this.meanOtherY = meanOtherY;
	this.sumValue = sumValue;
	this.meanValue = meanValue;
	this.sumX = sumX;
	this.meanX = meanX;
	this.sumY = sumY;
	this.meanY = meanY;

}


ProsodicStatistics.prototype.getCountRhyme = function()
{
	return this.countRhyme;
}
ProsodicStatistics.prototype.getSumRhymeValue = function()
{
	return this.sumRhymeValue;
}
ProsodicStatistics.prototype.getMeanRhymeValue = function()
{
	return this.meanRhymeValue;
}
ProsodicStatistics.prototype.getSumRhymeX = function()
{
	return this.sumRhymeX;
}
ProsodicStatistics.prototype.getMeanRhymeX = function()
{
	return this.meanRhymeX;
}
ProsodicStatistics.prototype.getSumRhymeY = function()
{
	return this.sumRhymeY;
}
ProsodicStatistics.prototype.getMeanRhymeY = function()
{
	return this.meanRhymeY;
}
ProsodicStatistics.prototype.getStdevRhymeValue = function()
{
	return this.stdevRhymeValue;
}
ProsodicStatistics.prototype.getStdevRhymeX = function()
{
	return this.stdevRhymeX;
}
ProsodicStatistics.prototype.getStdevRhymeY = function()
{
	return this.stdevRhymeY;
}
ProsodicStatistics.prototype.getCountAlliteration = function()
{
	return this.countAlliteration;
}
ProsodicStatistics.prototype.getSumAlliterationValue = function()
{
	return this.sumAlliterationValue;
}
ProsodicStatistics.prototype.getMeanAlliterationValue = function()
{
	return this.meanAlliterationValue;
}
ProsodicStatistics.prototype.getSumAlliterationX = function()
{
	return this.sumAlliterationX;
}
ProsodicStatistics.prototype.getMeanAlliterationX = function()
{
	return this.meanAlliterationX;
}
ProsodicStatistics.prototype.getSumAlliterationY = function()
{
	return this.sumAlliterationY;
}
ProsodicStatistics.prototype.getMeanAlliterationY = function()
{
	return this.meanAlliterationY;
}
ProsodicStatistics.prototype.getStdevAlliterationValue = function()
{
	return this.stdevAlliterationValue;
}
ProsodicStatistics.prototype.getStdevAlliterationX = function()
{
	return this.stdevAlliterationX;
}
ProsodicStatistics.prototype.getStdevAliterationY = function()
{
	return this.stdevAliterationY;
}
ProsodicStatistics.prototype.getCountAssonance = function()
{
	return this.countAssonance;
}
ProsodicStatistics.prototype.getSumAssonanceValue = function()
{
	return this.sumAssonanceValue;
}
ProsodicStatistics.prototype.getMeanAssonanceValue = function()
{
	return this.meanAssonanceValue;
}
ProsodicStatistics.prototype.getSumAssonanceX = function()
{
	return this.sumAssonanceX;
}
ProsodicStatistics.prototype.getMeanAssonanceX = function()
{
	return this.meanAssonanceX;
}
ProsodicStatistics.prototype.getSumAssonanceY = function()
{
	return this.sumAssonanceY;
}
ProsodicStatistics.prototype.getMeanAssonanceY = function()
{
	return this.meanAssonanceY;
}
ProsodicStatistics.prototype.getStdevAssonanceValue = function()
{
	return this.stdevAssonanceValue;
}
ProsodicStatistics.prototype.getStdevAssonanceX = function()
{
	return this.stdevAssonanceX;
}
ProsodicStatistics.prototype.getStdevAssonanceY = function()
{
	return this.stdevAssonanceY;
}
ProsodicStatistics.prototype.getCountConsonance = function()
{
	return this.countConsonance;
}
ProsodicStatistics.prototype.getSumConsonanceValue = function()
{
	return this.sumConsonanceValue;
}
ProsodicStatistics.prototype.getMeanConsonanceValue = function()
{
	return this.meanConsonanceValue;
}
ProsodicStatistics.prototype.getSumConsonanceX = function()
{
	return this.sumConsonanceX;
}
ProsodicStatistics.prototype.getMeanConsonanceX = function()
{
	return this.meanConsonanceX;
}
ProsodicStatistics.prototype.getSumConsonanceY = function()
{
	return this.sumConsonanceY;
}
ProsodicStatistics.prototype.getMeanConsonanceY = function()
{
	return this.meanConsonanceY;
}
ProsodicStatistics.prototype.getStdevConsonanceValue = function()
{
	return this.stdevConsonanceValue;
}
ProsodicStatistics.prototype.getStdevConsonanceX = function()
{
	return this.stdevConsonanceX;
}
ProsodicStatistics.prototype.getStdevConsonanceY = function()
{
	return this.stdevConsonanceY;
}
ProsodicStatistics.prototype.getCountOther = function()
{
	return this.countOther;
}
ProsodicStatistics.prototype.getSumOtherValue = function()
{
	return this.sumOtherValue;
}
ProsodicStatistics.prototype.getMeanOtherValue = function()
{
	return this.meanOtherValue;
}
ProsodicStatistics.prototype.getSumOtherX = function()
{
	return this.sumOtherX;
}
ProsodicStatistics.prototype.getMeanOtherX = function()
{
	return this.meanOtherX;
}
ProsodicStatistics.prototype.getSumOtherY = function()
{
	return this.sumOtherY;
}
ProsodicStatistics.prototype.getMeanOtherY = function()
{
	return this.meanOtherY;
}
ProsodicStatistics.prototype.getSumValue = function()
{
	return this.sumValue;
}
ProsodicStatistics.prototype.getMeanValue = function()
{
	return this.meanValue;
}
ProsodicStatistics.prototype.getSumX = function()
{
	return this.sumX;
}
ProsodicStatistics.prototype.getMeanX = function()
{
	return this.meanX;
}
ProsodicStatistics.prototype.getSumY = function()
{
	return this.sumY;
}
ProsodicStatistics.prototype.getMeanY = function()
{
	return this.meanY;
}



function ProsodicTextStanza ()
{
	
} 
//not sure if this will be used

function ProsodicTextLine ()
{
	this.syllables = new Array();		// an array of syllables - may be line property of 
	
	this.lengthsOfWords = new Array();	// array holding values which specify lengths of words in syllables e.g. An Tas a Nev y'm gelwir = 1,1,1,1,1,2; Formyer puptra a vydh gwrys = 2,2,1,1,1 - obtained using counter while reading syllables from VocalicText objects
	//this.lineNumberInStanza = 0;		// line number within its stanza
	this.lineNumberWithinTotal = 0;		// line number within all lines of the text - all lines with prosodic / vocalic content, that is -  zero-indexed  
	this.lineNumberWithinTotalIncludingNonVocalic = 0;		// line number within all lines of the electronic text source document, including lines entirely composed of non-vocalic text (eg comments, part names, stage directions, alternative readings, line numbers only, &c), or just carriage returns or white spaces -  zero-indexed
	//this.stanzaNumber = 0;			// the number of the stanza within which this line d'appear
	this.displayTextLineNumber = null;	// corresponding DisplayText line for this prosodic line 
	this.displayTextLine = null;		// cached reference to DisplayText line for this prosodic line
	this.prosodicTextDocument = null;	// the ProsodicTextDocument of which this is a line
	this.statistics = null;
}

ProsodicTextLine.prototype.setSyllables = function(SyllablesArray)
{
	this.syllables = SyllablesArray;
}

ProsodicTextLine.prototype.getSyllables = function()
{
	return this.syllables;
}

ProsodicTextLine.prototype.setSyllableByNumber = function(intIndex, Syllable)
{
	this.syllables[intIndex] = Syllable;
}

ProsodicTextLine.prototype.getSyllableByNumber = function(intIndex)
{
	return this.syllables[intIndex];
}


ProsodicTextLine.prototype.pushSyllable = function(syllable)	// push a single syllable onto line's array
{
	this.syllables.push(syllable);
	return syllable;
}

ProsodicTextLine.prototype.getSumOfSyllablesInLine = function()
{
	return this.syllables.length;			
}


ProsodicTextLine.prototype.setlengthsOfWords = function(lengthsOfWordsArray)
{
	this.lengthsOfWords = lengthsOfWordsArray;
}

ProsodicTextLine.prototype.getLengthsOfWords = function()
{
	return this.lengthsOfWords;
}

ProsodicTextLine.prototype.setLineNumberWithinTotalIncludingNonVocalic = function(lineNumber)
{
	this.lineNumberWithinTotalIncludingNonVocalic = lineNumber;
	return this.lineNumberWithinTotalIncludingNonVocalic;
}

// temporary ! quick 'fix' as i keep forgetting that full function name should be getLineNumberWithinTotalIncludingNonVocalic
ProsodicTextLine.prototype.getLineNumber = function()
{
	return this.lineNumberWithinTotalIncludingNonVocalic;
}



ProsodicTextLine.prototype.getLineNumberWithinTotalIncludingNonVocalic = function()
{
	return this.lineNumberWithinTotalIncludingNonVocalic;
}

ProsodicTextLine.prototype.setLineNumberWithinTotal = function(lineNumber)
{
	this.lineNumberWithinTotalIncludingNonVocalic = lineNumber;
}

ProsodicTextLine.prototype.getLineNumberWithinTotal = function()
{
	return this.lineNumberWithinTotalIncludingNonVocalic;
}


ProsodicTextLine.prototype.setProsodicTextDocument = function(prosodicTextDocument)
{
	this.prosodicTextDocument = prosodicTextDocument;
}

ProsodicTextLine.prototype.getProsodicTextDocument = function()
{
	return this.prosodicTextDocument;
}

// not sure if this will be used

ProsodicTextLine.prototype.getVectorOriginStringsOfAllSyllables = function ()
{
	// returns array of all prosodic vector strings (CSV - x,y,type,value) originating for all syllables in this line
	// not sure we need equivalent for vector strings of destination syllables
	
	var vectorStrings = [];
	for (i=0; i < this.getSyllables().length; i++)
	{
		for (j=0; j < this.getSyllableByNumber(i).getVectorOriginStrings().length; j++)		// for every syllable, for every vector string thereof
		{
			vectorStrings.push(this.getSyllableByNumber(i).getVectorOriginStrings()[j]);		// push every vector string onto the array (pushing multiple array cells at once seems not to work in javascript)
		}
	}
	
	return vectorStrings;
}	// end of getVectorOriginStringsOfAllSyllables function

ProsodicTextLine.prototype.getVectorDestinationStringsOfAllSyllables = function ()
{
	// returns array of all prosodic vector strings (CSV - x,y,type,value) whose destination is any and all syllables in this line
	// not sure if this is useful (since tis the inverse of ProsodicTextLine.getVectorOriginStringsOfAllSyllables)
	
	var vectorStrings = [];
	for (i=0; i < this.getSyllables().length; i++)
	{
		for (j=0; j < this.getSyllableByNumber(i).getVectorOriginStrings().length; j++)		// for every syllable, for every vector string thereof
		{
			vectorStrings.push(this.getSyllableByNumber(i).getVectorDestinationStrings()[j]);		// push every vector string onto the array (pushing multiple array cells at once seems not to work in javascript)
		}
	}
	
	return vectorStrings;
}	// end of getVectorDestinationStringsOfAllSyllables function


ProsodicTextLine.prototype.setDisplayTextLineNumber = function (displayTextLineNumber)
{
	this.displayTextLineNumber = displayTextLineNumber;
}

ProsodicTextLine.prototype.getDisplayTextLineNumber = function ()
{
	return this.displayTextLineNumber;
}


ProsodicTextLine.prototype.setDisplayTextLine = function (displayTextLine)
{
	this.displayTextLine = displayTextLine;
}

ProsodicTextLine.prototype.getDisplayTextLine = function ()
{
	return this.displayTextLine;
}


ProsodicTextLine.prototype.bulkProsodicLineProsodicChecks = function(prosodicTextProcessor)
{	
	// function - to run through all the Syllable objects within a ProsodicTextLine, performing prosodic harmony checks in bulk, for a Prosodic Text Line

	// TODO: (i) allow varying number of inter-linear / between line checks (in PTP property?) (ii) make comparisons stop at end of prosodic stanza
	
	// result: builds up ProsodicVector objects (and populates prosodic vector data properties of Syllable objects)
//alert('got here1');
	var lineSyllableCounter;	
	var lineLinks = [];		//	array to hold string (CSV - x,y,type,value) describing every link/vector prosodically linking syllables of this line (and with adjacent line(s) in search range)   
			
		for (lineSyllableCounter = 0; lineSyllableCounter < this.getSyllables().length; lineSyllableCounter++)		// for every syllable of this prosodic text line
		{//alert('got here2');	
			lineLinks = lineLinks.concat(prosodicTextProcessor.prosodicCheckOnProsodicLine(this, this.getSyllableByNumber(lineSyllableCounter), lineSyllableCounter));	// run a prosodic harmony check against this line
			
			for (var extraLine = 1; extraLine <= prosodicTextProcessor.getLineSearchRange(); extraLine++ )	// for every additional/external line to be counted, up to maximum desired (default: 1 line, but can be changed)
			{
				if(this.getLineNumberWithinTotal() + extraLine < this.getProsodicTextDocument().getLines().length)		// if there is a line beneath/after this line (NB zero-indexed line numbers) within standard prosody search range (default: 1 line)
				{
					prosodicTextProcessor.prosodicCheckOnProsodicLine(this.getProsodicTextDocument().getProsodicLineByNumber(this.getLineNumberWithinTotal() + extraLine), this.getSyllableByNumber(lineSyllableCounter), -1);// then also check for prosodic harmony between syllables on this line, and those on that line below
					// when calling function, suppling a -1 'index' argument in order to check through whole of line below (may involve some checking within 'south-westerly' quadrant from syllable-of-interest)
					// TODO: (ii) make comparisons stop at end of prosodic stanza
				}
			}
		}	
		return lineLinks;	// return array containing string (CSV - x,y,type,value) describing every link/vector prosodically linking syllables of this line (and with adjacent line(s) in search range)
		// eventually, DisplayText could have a displayProsodicLine(prosodicLine)  method which would render non-vocalic text, vocalic text and prosodic harmony vectors, all together
}

ProsodicTextLine.prototype.setStatistics = function(statistics)
{
	this.statistics = statistics;
	return statistics;
}

ProsodicTextLine.prototype.getStatistics = function()
{
	return this.statistics;
}



function ProsodicVector (syllableA, syllableB, linkType, value)
{
		// an instance of prosodic harmony (rhyme, alliteration, consonance, assonance) between 2 syllables
		// vector is magnitude plus direction
		// store here, point A and point B (cartesian, not polar coordinates) - NB not from/to: the vector could be considered bidirectional
		
	this.syllableA = syllableA;		// a syllable instance (one end of the link)
	this.syllableB = syllableB;		// a syllable instance (the other end of the link)
	this.linkType = linkType;		// the nature of the link (assonance | consonance | alliteration | rhyme) 
	this.value = value;				// the value (ranging from zero, normalised to 1) indicating weak or strong link 
	this.syllableALinkInfo = "";	// extra info about how the link pertains to syllable A (which part, &c)
	this.syllableBLinkInfo = "";	// extra info about how the link pertains to syllable B (which part, &c)
	this.string="";					// x value,y value, type, value (, other info)
	this.xOffset = 0;				// x offset - distance along line
	this.yOffset = 0;				// y offset - distance below (or above) line
	//this.graphics = [];				// NB was an array which can hold reference to an array of graphics objects representing the vector
	this.drawn = false;				// flag to show whether vector is presently drawn
	this.graphics = null;			// reference to an graphic objects representing the vector
}
// to be represented graphically by a link between 2 syllables

ProsodicVector.prototype.setSyllableALinkInfo = function (syllableALinkInfo)	// in case info about the link happens to change
{
	this.syllableALinkInfo = syllableALinkInfo;
}

ProsodicVector.prototype.getSyllableALinkInfo = function ()
{
	return this.syllableALinkInfo;
}

ProsodicVector.prototype.setSyllableBLinkInfo = function (syllableBLinkInfo)
{
	this.syllableBLinkInfo = syllableBLinkInfo;
}

ProsodicVector.prototype.getSyllableBLinkInfo = function ()
{
	return this.syllableBLinkInfo;
}


ProsodicVector.prototype.setSyllableA = function (syllableA)
{
	this.syllableA = syllableA;
}

ProsodicVector.prototype.getSyllableA = function ()
{
	return this.syllableA;
}

ProsodicVector.prototype.setSyllableB = function (syllableB)
{
	this.syllableB = syllableB;
}

ProsodicVector.prototype.getSyllableB = function ()
{
	return this.syllableB;
}

ProsodicVector.prototype.getLinkType = function ()
{
	return this.linkType;
}

ProsodicVector.prototype.getValue = function ()
{
	return this.value;
}


ProsodicVector.prototype.setString = function (str)
{
	this.string = str;
}

ProsodicVector.prototype.getString = function ()
{
	return this.string;
}

ProsodicVector.prototype.setXOffset = function (xOffset)
{
	this.xOffset = xOffset;
}

ProsodicVector.prototype.getXOffset = function ()
{
	return this.xOffset;
}

ProsodicVector.prototype.setYOffset = function (yOffset)
{
	this.yOffset = yOffset;
}

ProsodicVector.prototype.getYOffset = function ()
{
	return this.yOffset;
}

ProsodicVector.prototype.setDrawn = function (boolDrawn)
{
	this.drawn = boolDrawn;
	return this.drawn;
}

ProsodicVector.prototype.getDrawn = function ()
{
	return this.drawn;
}

ProsodicVector.prototype.setGraphics = function(graphics) 		// set the reference within ProsodicVector instance to an array of graphic objects which d'represent the vector - edit 18-12-15, to a composite vector graphic array, representing this prosodic vector, possibly among others with the same syllable terminii 
{
	this.graphics = graphics;
	this.drawn = true;			// set the flag to show that graphics have been assigned (ie vector has been drawn)
	return graphics;			// return the graphic as well
}

ProsodicVector.prototype.getGraphics = function()
{
	return this.graphics;
}


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



function xyValue (x,y)		// constructor for xy value (could be point coordinates; or offset, for example)
{
	this.x = x;
	this.y = y;
}

xyValue.prototype.setX = function (x)
{
	this.x = x;	
}

xyValue.prototype.getX = function ()
{
	return this.x;	
}

xyValue.prototype.setY = function (y)
{
	this.y = y;	
}

xyValue.prototype.getY = function ()
{
	return this.y;	
}


function CompositeProsodicVectorGraphic(syllableA, syllableB, vectorGraphicArray)
{
	
	// class/prototype of a graphic representing a vector or several vectors between 2 identical syllables
	// this saves resources, compared with having a separate vector graphic for every vector, even where they are between the same pair of syllables
	
	this.syllableA = syllableA;
	this.syllableB = syllableB;
	this.graphics = vectorGraphicArray;				// refers to the array of graphic objects (leader line A, link line, leader line B) representing all vectors coterminous between these 2 syllables (3 element array of leader line A, link line & leader line B)   
	
	this.number = null;			// a serial number of this composite prosodic vector graphic, within series of such objects (set during push) 
	
	this.prosodicVectors = new Array();		// array of prosodic vector(s) (with same origin/destination) composited/combined/incorporated into this composite graphic vector
	
}

CompositeProsodicVectorGraphic.prototype.getSyllableA = function()
{
	return this.syllableA;
}

CompositeProsodicVectorGraphic.prototype.getSyllableB = function()
{
	return this.syllableB;	
}

CompositeProsodicVectorGraphic.prototype.getProsodicVectors = function ()
{
	return this.prosodicVectors;	// return all prosodic vectors combined within this composite graphic vector 
}


CompositeProsodicVectorGraphic.prototype.getProsodicVectorByNumber = function (vectorNumber)
{
	return this.prosodicVectors[vectorNumber];		// return a specific prosodic vector by index number
}


CompositeProsodicVectorGraphic.prototype.pushProsodicVector = function (prosodicVector)
{
	this.prosodicVectors.push(prosodicVector);		// add a prosodic vector to the composite graphic vector by pushing to its array of prosodic vectors
	return prosodicVector;
}


CompositeProsodicVectorGraphic.prototype.getGraphics = function()
{
	return this.graphics;	// returns graphics SVG polyline (NB was until 17/12/15 a 3 element array of leader line A, link line & leader line B) depicting this composite vector 
}


CompositeProsodicVectorGraphic.prototype.showCompositeProsodicVectorGraphic = function ()
{
	for (i=0; i < this.graphics.length; i++)	// for every element in composite prosodic vector's graphics (leader line A, link line, leader line B)
	{
		this.graphics[i].show();		// show this graphic
	}
}


CompositeProsodicVectorGraphic.prototype.hideCompositeProsodicVectorGraphic = function ()
{
	for (i=0; i < this.graphics.length; i++)	// for every element in composite prosodic vector's graphics (leader line A, link line, leader line B)
	{
		this.graphics[i].hide();		// hide this graphic
	}	
}

CompositeProsodicVectorGraphic.prototype.getCompositeVectorGraphicNumber = function ()
{
	return this.number;
}

CompositeProsodicVectorGraphic.prototype.setCompositeVectorGraphicNumber = function (number)
{
	this.number = number;
}


/*
compositeProsodicVectorGraphic.prototype.
*/
/*
compositeProsodicVectorGraphic.prototype.
*/
/*
compositeProsodicVectorGraphic.prototype.
*/




