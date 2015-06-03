var should=require('should'),
	gitShow=require('../git_show.js'),
	testRepo="/Users/aumkara/workspace/MuMoo",
	debug=require('debug')('git:test');;

describe('git-show', function gitShowLib() {
	debug=require('debug')('git:test:gitShowLib');
	before(function chdirTestrepo(done) {
		debug=require('debug')('git:test:gitShowLib:chdirTestrepo');
		process.chdir(testRepo);
		done();
	});
	
	it("should return a promise", function test(done) {
		debug=require('debug')('git:test:gitShowLib:test');
		var returnObject=gitShow({});
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
		gitShow({}).
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
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					output.averageLinesChanged.should.not.equal(undefined);
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
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					output.varianceLinesChanged.should.not.equal(undefined);
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
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					output.standardDeviationLinesChanged.should.not.equal(undefined);
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
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					output.averageLinesAdded.should.not.equal(undefined);
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
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					output.varianceLinesAdded.should.not.equal(undefined);
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
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					output.standardDeviationLinesAdded.should.not.equal(undefined);
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
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					output.averageLinesDeleted.should.not.equal(undefined);
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
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					output.varianceLinesDeleted.should.not.equal(undefined);
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
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					output.standardDeviationLinesDeleted.should.not.equal(undefined);
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
			gitShow({commit:'HEAD'}).
				then(function onResolve(output) {
					debug=require('debug')('git:test:gitShowLib:results:test:onResolve');
					debug("output: %j", output);
					output.diffs.should.not.equal(undefined);
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
			process.chdir("/Users/aumkara/workspace/MuMoo");
			gitShow({commit:'ddc35cc710a103e3c3525f12e6106b1b94666f55'}).
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
	});
});