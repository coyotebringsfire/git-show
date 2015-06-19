"use strict";
var async=require('async');

var Git=require('git-wrapper2'),
	ss=require('simple-statistics'),
	Q=require('q');

function GitShow(options) {
	var debug=require('debug')('git:GitShow'),
		git=new Git({'C':options.cwd}), gitExecPromise=Q.defer();

	debug("showing commit %j", options.commit);
	git.exec("show", [options.commit], function results(err, show_out) {
		debug=require('debug')('git:GitShow:results');
		if(err) {
			debug("err: %j", err);
			return gitExecPromise.reject(err);
		}
		if( show_out==undefined ) {
			return gitExecPromise.resolve(null);
		}
		debug("show output: %s", show_out);
		var out=show_out.split('\n'), currentDiff, allDiffs=[], showPromise=Q.defer(),
			commit={
				hash: undefined,
				author: undefined,
				date: undefined,
				message: undefined
			};
		
		async.eachSeries( out, function forEachLine(line, nextLine) {
			debug=require('debug')('git:GitShow:results:forEachLine');
			debug("line %s", line);
			debug("allDiffs %j", allDiffs);
			debug("commit %j", commit);
			if( allDiffs.length===0 ) {
				if( commit.hash===undefined) {
					commit.hash=line.match(/.*commit ([0123456789abcdef]+)/)[1];
					debug("setting hash %s", commit.hash);
					return nextLine();
				}
				if( commit.author===undefined) {
					debug("setting author");
					var authorMatch=line.match(/Author: ([^ ]+) <([^>]+)>/);
					commit.author={
						name: authorMatch[1],
						email: authorMatch[2]
					};
					return nextLine();
				}
				if( commit.date===undefined) {
					debug("setting date");
					commit.date=line.match(/Date:\s+(.+)$/)[1];
					return nextLine();
				}
				if(line==="") {
					if(commit.message) {
						debug("adding blank line");
						commit.message+="\n";
						return nextLine();
					}
				}
				if( commit.message===undefined) {
					debug("setting message");
					commit.message=line;
					return nextLine();
				}
				if( commit.message==="" ) {
					debug("updating message");
					commit.message+=line;
					return nextLine();
				}
			}
			debug("currentDiff %j", currentDiff);
			if( currentDiff === undefined ) {
				debug("looking for diff line\n%s", line);
				var match=line.match(/^diff --git a\/([^ ]+) b\/(.+)/);
				if( match ) {
					debug("new diff %s %s", match[1], match[2]);
					currentDiff={
						linesAdded: 0,
						linesDeleted: 0,
						deltas: 0,
						fileOne: match[1],
						fileTwo: match[2]
					};
					return nextLine();
				}
			} else {
				//look for new file line
				debug("looking for new file");
				var newFileLineMatch=line.match(/new file mode ([a-zA-Z0-9]{6})/);
				if( newFileLineMatch ){
					return nextLine();
				}
				//look for index line
				var indexLineMatch=line.match(/^index ([a-zA-Z0-9]+)\.\.([a-zA-Z0-9]+) ([0-7]{6})/), 
					plusLine, minusLine, newDiffMatch; 
				debug("looking for index");
				if( match ) {
					debug("index line: %s %s %s", indexLineMatch[1], indexLineMatch[2], indexLineMatch[3]);
					currentDiff.startingHash=indexLineMatch[1];
					currentDiff.endingHash=indexLineMatch[2];
					currentDiff.mode=indexLineMatch[3];
					return nextLine();
				}
				//look for +++ line
				plusLine=line.match(/^\+{3} a\/[.+]/);
				debug("looking for +++");
				if( plusLine ) {
					debug("+++");
					return nextLine();
				}
				//look for --- line
				minusLine=line.match(/^-{3} b\/[.+]/);
				debug("looking for ---");
				if( minusLine ) {
					debug("---");
					return nextLine();
				}
				//look for the line
				debug("looking for + or - in %s", line);
				if(line.match(/^-/)) {
					currentDiff.linesDeleted++;
					debug("one more line deleted %d", currentDiff.linesDeleted);
				}
				if(line.match(/^\+/)) {
					currentDiff.linesAdded++;
					debug("one more line added %d", currentDiff.linesAdded);
				}
				newDiffMatch=line.match(/^diff --git a\/([^ ]+) b\/(.+)/);
				debug("looking for new diff in %s", line);
				if(newDiffMatch) {
					currentDiff.deltas=currentDiff.linesAdded-currentDiff.linesDeleted;
					allDiffs.push(currentDiff);
					currentDiff={
						linesAdded: 0,
						linesDeleted: 0,
						deltas: 0,
						fileOne: newDiffMatch[1],
						fileTwo: newDiffMatch[2]
					};
				}
				return nextLine();
			}
		}, function afterEveryLineIsProcessed(err) {
			//add the last diff
			currentDiff.deltas=currentDiff.linesAdded-currentDiff.linesDeleted;
			allDiffs.push(currentDiff);
			debug=require('debug')('git:GitShow:results:afterEveryLineIsProcessed');
			debug("allDiffs %j", allDiffs);
			var numDiffs=allDiffs.length, allDeltas=[], allAdditions=[], allDeletions=[],
				totalLinesChanged=0, averageLinesChanged=0, varianceLinesChanged=0, standardDeviationLinesChanged=0,
				averageLinesAdded=0, varianceLinesAdded=0, standardDeviationLinesAdded=0,
				averageLinesDeleted=0, varianceLinesDeleted=0, standardDeviationLinesDeleted=0;

			debug("all lines processed");
			async.each( allDiffs, function eachDiff(d, done) {
				debug=require('debug')('git:GitShow:results:afterEveryLineIsProcessed:eachDiff');
				debug("adding diff %d", d.deltas);
				totalLinesChanged+=d.deltas;
				allDeltas.push(d.deltas);
				allAdditions.push(d.linesAdded);
				allDeletions.push(d.lineesDeleted);
				done();
			}, function afterTotalLinesCalculated(err) {
				debug=require('debug')('git:GitShow:results:afterEveryLineIsProcessed:afterTotalLinesCalculated');
				if(err) {
					debug("err: %j", err);
					return gitExecPromise.reject(err);
				}
				averageLinesChanged=ss.mean(allDeltas);
				varianceLinesChanged=ss.variance(allDeltas);
				standardDeviationLinesChanged=ss.standard_deviation(allDeltas);

				averageLinesAdded=ss.mean(allDeltas);
				varianceLinesAdded=ss.variance(allDeltas);
				standardDeviationLinesAdded=ss.standard_deviation(allDeltas);
				
				averageLinesDeleted=ss.mean(allDeltas);
				varianceLinesDeleted=ss.variance(allDeltas);
				standardDeviationLinesDeleted=ss.standard_deviation(allDeltas);
				debug("resolving promise %j %d %d %d", allDeltas, averageLinesChanged, varianceLinesChanged, standardDeviationLinesChanged );
				
				gitExecPromise.resolve({
					averageLinesChanged: averageLinesChanged,
					varianceLinesChanged: varianceLinesChanged,
					standardDeviationLinesChanged: standardDeviationLinesChanged,
					averageLinesAdded: averageLinesAdded,
					varianceLinesAdded: varianceLinesAdded,
					standardDeviationLinesAdded: standardDeviationLinesAdded,
					averageLinesDeleted: averageLinesDeleted,
					varianceLinesDeleted: varianceLinesDeleted,
					standardDeviationLinesDeleted: standardDeviationLinesDeleted,
					diffs: allDiffs
				});
			});
		});
	});
	return gitExecPromise.promise;
}

module.exports=GitShow;