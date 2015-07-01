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
		debug("err %j out %j", err, show_out);
		if(err) {
			debug("err: %j", err);
			return gitExecPromise.reject(err);
		}
		if( show_out==undefined ) {
			return gitExecPromise.resolve(null);
		}
		//debug("show output: %s", show_out);
		var out=show_out.split('\n'), currentDiff, allDiffs=[], showPromise=Q.defer(),
			commit={
				hash: undefined,
				author: undefined,
				date: undefined,
				message: undefined
			};
		debug("out %j", out);
		
		async.eachSeries( out, function forEachLine(line, nextLine) {
			var commitMatch, authorMatch, dateMatch, mergeMatch, diffMatch;
			debug=require('debug')('git:GitShow:results:forEachLine');
			debug("line %s", line);
			debug("allDiffs %j", allDiffs);
			debug("commit %j", commit);
			commit.message="";
			if( undefined===currentDiff ) {
				commitMatch=line.match(/.*commit ([0123456789abcdef]+)/);
				if( commitMatch ) {
					commit.hash=commitMatch[1];
					debug("setting hash %s", commit.hash);
					return nextLine();
				}
				mergeMatch=line.match(/Merge: ([^ ]+) ([^ ]+)^/);
				if(mergeMatch) {
					debug("setting merge");
					commits.merge={
						a: mergeMatch[1],
						b: mergeMatch[2]
					};
					return nextLine();
				}
				authorMatch=line.match(/Author: ([^ ]+) <([^>]+)>/);
				if( authorMatch ) {
					debug("setting author %s", line);
					commit.author={
						name: authorMatch[1],
						email: authorMatch[2]
					};
					return nextLine();
				}
				dateMatch=line.match(/Date:\s+(.+)$/);
				if( dateMatch ) {
					debug("setting date");
					commit.date=dateMatch[1];
					return nextLine();
				}
				if(line.match(/^$/)) {
					if(commit.message) {
						debug("adding blank line");
						commit.message+="\n";
						return nextLine();
					}
				}
				diffMatch=line.match(/^diff --git a\/([^ ]+) b\/(.+)/);
				if(diffMatch) {
					debug("new diff %s %s", diffMatch[1], diffMatch[2]);
					currentDiff={
						linesAdded: 0,
						linesDeleted: 0,
						deltas: 0,
						fileOne: diffMatch[1],
						fileTwo: diffMatch[2]
					};
					return nextLine();
				}
				debug("setting message");
				commit.message+=line;
				return nextLine();
			}
			debug("currentDiff %j", currentDiff);
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
			if( indexLineMatch ) {
				debug("index line: %s %s %s", indexLineMatch[1], indexLineMatch[2], indexLineMatch[3]);
				currentDiff.startingHash=indexLineMatch[1];
				currentDiff.endingHash=indexLineMatch[2];
				currentDiff.mode=indexLineMatch[3];
				return nextLine();
			}
			//look for +++ line in a
			plusLine=line.match(/^\+{3} a\/.+/);
			debug("looking for +++");
			if( plusLine ) {
				debug("+++");
				return nextLine();
			}
			//look for +++ line in b
			plusLine=line.match(/^\+{3} b\/.+/);
			debug("looking for +++");
			if( plusLine ) {
				debug("+++");
				return nextLine();
			}
			//look for --- line in a
			minusLine=line.match(/^-{3} a\/.+/);
			debug("looking for ---");
			if( minusLine ) {
				debug("---");
				return nextLine();
			}
			//look for --- line in b
			minusLine=line.match(/^-{3} b\/.+/);
			debug("looking for ---");
			if( minusLine ) {
				debug("---");
				return nextLine();
			}
			debug("look for @@ line in %s", line);
			if( line.match(/^@@.+@@$/) ) {
				debug("@@");
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
				return nextLine();
			}
			nextLine();
		}, function afterEveryLineIsProcessed(err) {
			//add the last diff
			if( currentDiff ) {
				currentDiff.deltas=currentDiff.linesAdded-currentDiff.linesDeleted;
				allDiffs.push(currentDiff);
			}
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
				allDeletions.push(d.linesDeleted);
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

				averageLinesAdded=ss.mean(allAdditions);
				varianceLinesAdded=ss.variance(allAdditions);
				standardDeviationLinesAdded=ss.standard_deviation(allAdditions);
				
				averageLinesDeleted=ss.mean(allDeletions);
				varianceLinesDeleted=ss.variance(allDeletions);
				standardDeviationLinesDeleted=ss.standard_deviation(allDeletions);
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