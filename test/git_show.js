var should=require('should'),
	gitShow=require('../git_show.js'),
	rimraf=require('rimraf'),
	run=require('comandante');
	testRepo=__dirname,
	debug=require('debug')('git:test');

describe('git-show', function gitShowLib() {
	this.timeout(0);
	debug=require('debug')('git:test:gitShowLib');
	
	it("should return a promise", function test(done) {
		debug=require('debug')('git:test:gitShowLib:test');
		process.chdir(testRepo);
		var returnObject=gitShow();
		//duck-type check the returned object to see if it's thennable
		returnObject.then.should.be.type('function');
		returnObject.then(function onResolve() {
			debug=require('debug')('git:test:gitShowLib:test:onResolve');
			done();
		}, function onReject() {
			debug=require('debug')('git:test:gitShowLib:test:onReject');
			should.fail();
			done();
		});
	});
	it("should reject promise for invalid commit hash", function test(done) {
		debug=require('debug')('git:test:gitShowLib:test');
		process.chdir(testRepo);
		gitShow({commit:'invalidhash'}).
			then(function onResolve(output) {
				debug=require('debug')('git:test:gitShowLib:test:onResolve');
				should.fail();
				done();
			}, function onReject(err) {
				debug=require('debug')('git:test:gitShowLib:test:onReject');
				debug("err: %j", err);
				err.should.match(/unknown revision or path not in the working tree/);
				done();
			});
	});
	it("should resolve promise for HEAD if not passed a commit hash", function test(done) {
		debug=require('debug')('git:test:gitShowLib:test');
		process.chdir(testRepo);
		gitShow().
			then(function onResolve(output) {
				debug=require('debug')('git:test:gitShowLib:test:onResolve');
				debug("output: %j", output);
				done();
			}, function onReject(err) {
				debug=require('debug')('git:test:gitShowLib:test:onReject');
				should.fail(err);
				done();
			});
	});
	it("should resolve promise for specified commit hash", function test(done) {
		debug=require('debug')('git:test:gitShowLib:test');
		process.chdir(testRepo);
		gitShow({commit:'HEAD'}).
			then(function onResolve(output) {
				debug=require('debug')('git:test:gitShowLib:test:onResolve');
				output.should.be.ok;
				done();
			}, function onReject(err) {
				debug=require('debug')('git:test:gitShowLib:test:onReject');
				should.fail(err);
				done();
			});
	});
	describe("results", function() {
		it("should contain average lines changed", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:test');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					should(output.averageLinesChanged).not.equal(undefined);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:test:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});	
		it("should contain variance lines changed", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:test');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					should(output.varianceLinesChanged).not.equal(undefined);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:test:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});	
		it("should contain standard deviation lines changed", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:test');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					should(output.standardDeviationLinesChanged).not.equal(undefined);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:test:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});
		it("should contain average lines added", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:test');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					should(output.averageLinesAdded).not.equal(undefined);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:test:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});	
		it("should contain variance lines added", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:test');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					should(output.varianceLinesAdded).not.equal(undefined);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:test:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});	
		it("should contain standard deviation lines added", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:test');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					should(output.standardDeviationLinesAdded).not.equal(undefined);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:test:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});	
		it("should contain average lines removed", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:test');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					should(output.averageLinesDeleted).not.equal(undefined);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:test:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});	
		it("should contain variance lines removed", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:test');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					should(output.varianceLinesDeleted).not.equal(undefined);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:test:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});	
		it("should contain standard deviation lines removed", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:test');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					should(output.standardDeviationLinesDeleted).not.equal(undefined);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:test:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});	
		it("should contain all diffs", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:test');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					should(output.diffs).not.equal(undefined);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:test:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});	
	});
	describe("bugfixes", function() {
		before(function beforeBugfixes(done) {
			// clone repo to /tmp/auth0-widget.js
			rimraf("/tmp/auth0-widget.js", function onRimRafDone() {
				var gc=run('git', ["clone", "https://github.com/auth0/widget.git", "/tmp/auth0-widget.js"], {env:{"GIT_TERMINAL_PROMPT":"0"}});
		    gc.response="";
		    gc.on('error', function onError(msg) {
		      done(new Error(msg));
		    });
		    gc.on('data', function onData(data) {
		      gc.response+=data;
		    });
		    gc.on('end', function onEnd(err) {
		      if (err) {
		        return done(err);
		      }
		      done();
		    });
			});
		});
		it("should fix GITSHOW-1", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:BUGFIX1');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:BUGFIX1:onResolve');
					output.should.be.ok;
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:test:onReject');
					should.fail(err);
					done();
				});
		});
		it('should fix GITSHOW-2 - stats for additions and deletions were using all changes', function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:BUGFIX2');
			process.chdir(testRepo);
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:BUGFIX2:onResolve');
					debug("output: %j", output);
					if( output.averageLinesChanged ) {
						output.averageLinesChanged.should.not.equal(output.averageLinesDeleted);
						output.averageLinesChanged.should.not.equal(output.averageLinesAdded);
					}
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:results:BUGFIX2:onReject');
					debug("err %j", err);
					should.fail(err);
					done();
				});
		});
		it("should fix GITSHOW-3: set statistics to 0 if the result is null", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:BUGFIX4');
			var testRepo="/tmp/auth0-widget.js";
			var commitHash='9581a54c0301bc81cd7f97b73cbc679a37ec219e';
			process.chdir(testRepo);
			gitShow({commit:commitHash}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:BUGFIX4:onResolve');
					output.should.be.ok;
					output.averageLinesChanged.should.equal(0);
					output.varianceLinesChanged.should.equal(0);
					output.standardDeviationLinesChanged.should.equal(0);
					output.averageLinesAdded.should.equal(0);
					output.varianceLinesAdded.should.equal(0);
					output.standardDeviationLinesAdded.should.equal(0);
					output.averageLinesDeleted.should.equal(0);
					output.varianceLinesDeleted.should.equal(0);
					output.standardDeviationLinesDeleted.should.equal(0);
					done();
				}, function onReject(err) {
					debug=require('debug')('git:test:gitShowLib:test:onReject');
					should.fail(err);
					done();
				});
		});
	});
});
