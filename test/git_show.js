var should=require('should'),
	gitShow=require('../git_show.js'),
	testRepo=__dirname,
	debug=require('debug')('git:test');;

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
		it("should fix GITSHOW-3", function test(done) {
			debug=require('debug')('git:test:gitShowLib:results:BUGFIX2');
			testRepo="/Users/aumkara/workspace/ags-download";
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
	});
});