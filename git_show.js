		git=new Git({'C':options.cwd}), gitExecPromise=Q.defer();
		debug("err %j out %j", err, show_out);
		//debug("show output: %s", show_out);
		debug("out %j", out);
			debug("allDiffs %j", allDiffs);
			debug("commit %j", commit);
					commit.hash=line.match(/.*commit ([0123456789abcdef]+)/)[1];
					debug("setting hash %s", commit.hash);
					return nextLine();
					var authorMatch=line.match(/Author: ([^ ]+) <([^>]+)>/);
					commit.author={
						name: authorMatch[1],
						email: authorMatch[2]
					};
					return nextLine();
					commit.date=line.match(/Date:\s+(.+)$/)[1];
					return nextLine();
						debug("adding blank line");
						return nextLine();
					return nextLine();
				}
				if( commit.message==="" ) {
					debug("updating message");
					commit.message+=line;
					return nextLine();
				}
			debug("currentDiff %j", currentDiff);
				debug("looking for diff line\n%s", line);
					return nextLine();
					return nextLine();
					return nextLine();
					return nextLine();
					return nextLine();
				return nextLine();
				allDeletions.push(d.linesDeleted);
				averageLinesAdded=ss.mean(allAdditions);
				varianceLinesAdded=ss.variance(allAdditions);
				standardDeviationLinesAdded=ss.standard_deviation(allAdditions);
				averageLinesDeleted=ss.mean(allDeletions);
				varianceLinesDeleted=ss.variance(allDeletions);
				standardDeviationLinesDeleted=ss.standard_deviation(allDeletions);