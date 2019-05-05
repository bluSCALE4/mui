/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + ".hot/" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + ".hot/" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "ba364a9aecaefb005ba2";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded chunks
/******/ 	// "0" means "already loaded"
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// require() chunk loading for javascript
/******/
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] !== 0) {
/******/ 			var chunk = require("./" + chunkId + ".chunk.js");
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids;
/******/ 			for(var moduleId in moreModules) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// uncaught error handler for webpack runtime
/******/ 	__webpack_require__.oe = function(err) {
/******/ 		process.nextTick(function() {
/******/ 			throw err; // catch this error by using import().catch()
/******/ 		});
/******/ 	};
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../../src/App.css":
/*!********************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/App.css ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n    var content = __webpack_require__(/*! !../node_modules/cra-universal/node_modules/css-loader!./App.css */ \"../../node_modules/css-loader/index.js!../../../../src/App.css\");\n    var insertCss = __webpack_require__(/*! ../node_modules/isomorphic-style-loader/lib/insertCss.js */ \"../../../isomorphic-style-loader/lib/insertCss.js\");\n\n    if (typeof content === 'string') {\n      content = [[module.i, content, '']];\n    }\n\n    module.exports = content.locals || {};\n    module.exports._getContent = function() { return content; };\n    module.exports._getCss = function() { return content.toString(); };\n    module.exports._insertCss = function(options) { return insertCss(content, options) };\n    \n    // Hot Module Replacement\n    // https://webpack.github.io/docs/hot-module-replacement\n    // Only activated in browser context\n    if ( true && typeof window !== 'undefined' && window.document) {\n      var removeCss = function() {};\n      module.hot.accept(/*! !../node_modules/cra-universal/node_modules/css-loader!./App.css */ \"../../node_modules/css-loader/index.js!../../../../src/App.css\", function() {\n        content = __webpack_require__(/*! !../node_modules/cra-universal/node_modules/css-loader!./App.css */ \"../../node_modules/css-loader/index.js!../../../../src/App.css\");\n\n        if (typeof content === 'string') {\n          content = [[module.i, content, '']];\n        }\n\n        removeCss = insertCss(content, { replace: true });\n      });\n      module.hot.dispose(function() { removeCss(); });\n    }\n  \n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/App.css?");

/***/ }),

/***/ "../../../../src/App.js":
/*!*******************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/App.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var Components_NavigationBar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/NavigationBar */ \"../../../../src/Components/NavigationBar/index.js\");\n/* harmony import */ var Components_Sidebar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Components/Sidebar */ \"../../../../src/Components/Sidebar/index.js\");\n/* harmony import */ var routes_Features__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! routes/Features */ \"../../../../src/routes/Features/index.js\");\n/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./App.css */ \"../../../../src/App.css\");\n/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_5__);\nvar _jsxFileName = \"C:\\\\Users\\\\luisl\\\\Sites\\\\mui\\\\src\\\\App.js\";\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\n\n\n\n\n\n\nconst mock = [{\n  id: 1,\n  name: 'Receiveables',\n  selected: true,\n  menuGroups: [{\n    id: 1,\n    name: 'Create',\n    component: 'Create',\n    path: '/create'\n  }, {\n    id: 2,\n    name: 'Edit',\n    component: 'Edit',\n    path: '/edit'\n  }]\n}, {\n  id: 2,\n  name: 'Transactions',\n  menuGroups: [{\n    id: 3,\n    name: 'Transactions',\n    component: 'Transactions',\n    path: 'transactions'\n  }]\n}];\n\nconst App = () => {\n  const [tabs] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(mock);\n  const [tabId, setTab] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(tabs.find(x => x.selected).id);\n  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"App\",\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 44\n    }\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Components_NavigationBar__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n    tabs: tabs,\n    tabId: tabId,\n    setTab: setTab,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 45\n    }\n  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__[\"BrowserRouter\"], {\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 46\n    }\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    style: {\n      display: 'flex'\n    },\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 47\n    }\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Components_Sidebar__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n    menuGroups: tabs.find(({\n      id\n    }) => id === tabId).menuGroups,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 48\n    }\n  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"section\", {\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 49\n    }\n  }, tabs.map(tab => tab.menuGroups.map((feature, i) => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(routes_Features__WEBPACK_IMPORTED_MODULE_4__[\"default\"], _extends({\n    key: i\n  }, feature, {\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 52\n    }\n  }))))))));\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (App);\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/App.js?");

/***/ }),

/***/ "../../../../src/Components lazy recursive ^\\.\\/.*$":
/*!******************************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/Components lazy ^\.\/.*$ namespace object ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./Create\": [\n\t\t\"../../../../src/Components/Create/index.js\",\n\t\t0\n\t],\n\t\"./Create/\": [\n\t\t\"../../../../src/Components/Create/index.js\",\n\t\t0\n\t],\n\t\"./Create/Create\": [\n\t\t\"../../../../src/Components/Create/Create.js\",\n\t\t2\n\t],\n\t\"./Create/Create.js\": [\n\t\t\"../../../../src/Components/Create/Create.js\",\n\t\t2\n\t],\n\t\"./Create/index\": [\n\t\t\"../../../../src/Components/Create/index.js\",\n\t\t0\n\t],\n\t\"./Create/index.js\": [\n\t\t\"../../../../src/Components/Create/index.js\",\n\t\t0\n\t],\n\t\"./Edit\": [\n\t\t\"../../../../src/Components/Edit/index.js\",\n\t\t1\n\t],\n\t\"./Edit/\": [\n\t\t\"../../../../src/Components/Edit/index.js\",\n\t\t1\n\t],\n\t\"./Edit/Edit\": [\n\t\t\"../../../../src/Components/Edit/Edit.js\",\n\t\t3\n\t],\n\t\"./Edit/Edit.js\": [\n\t\t\"../../../../src/Components/Edit/Edit.js\",\n\t\t3\n\t],\n\t\"./Edit/index\": [\n\t\t\"../../../../src/Components/Edit/index.js\",\n\t\t1\n\t],\n\t\"./Edit/index.js\": [\n\t\t\"../../../../src/Components/Edit/index.js\",\n\t\t1\n\t],\n\t\"./Loading\": [\n\t\t\"../../../../src/Components/Loading/index.js\"\n\t],\n\t\"./Loading/\": [\n\t\t\"../../../../src/Components/Loading/index.js\"\n\t],\n\t\"./Loading/Loading\": [\n\t\t\"../../../../src/Components/Loading/Loading.js\"\n\t],\n\t\"./Loading/Loading.js\": [\n\t\t\"../../../../src/Components/Loading/Loading.js\"\n\t],\n\t\"./Loading/index\": [\n\t\t\"../../../../src/Components/Loading/index.js\"\n\t],\n\t\"./Loading/index.js\": [\n\t\t\"../../../../src/Components/Loading/index.js\"\n\t],\n\t\"./NavigationBar\": [\n\t\t\"../../../../src/Components/NavigationBar/index.js\"\n\t],\n\t\"./NavigationBar/\": [\n\t\t\"../../../../src/Components/NavigationBar/index.js\"\n\t],\n\t\"./NavigationBar/NavigationBar\": [\n\t\t\"../../../../src/Components/NavigationBar/NavigationBar.js\"\n\t],\n\t\"./NavigationBar/NavigationBar.js\": [\n\t\t\"../../../../src/Components/NavigationBar/NavigationBar.js\"\n\t],\n\t\"./NavigationBar/index\": [\n\t\t\"../../../../src/Components/NavigationBar/index.js\"\n\t],\n\t\"./NavigationBar/index.js\": [\n\t\t\"../../../../src/Components/NavigationBar/index.js\"\n\t],\n\t\"./NotFound\": [\n\t\t\"../../../../src/Components/NotFound/index.js\"\n\t],\n\t\"./NotFound/\": [\n\t\t\"../../../../src/Components/NotFound/index.js\"\n\t],\n\t\"./NotFound/index\": [\n\t\t\"../../../../src/Components/NotFound/index.js\"\n\t],\n\t\"./NotFound/index.js\": [\n\t\t\"../../../../src/Components/NotFound/index.js\"\n\t],\n\t\"./Sidebar\": [\n\t\t\"../../../../src/Components/Sidebar/index.js\"\n\t],\n\t\"./Sidebar/\": [\n\t\t\"../../../../src/Components/Sidebar/index.js\"\n\t],\n\t\"./Sidebar/Sidebar\": [\n\t\t\"../../../../src/Components/Sidebar/Sidebar.js\"\n\t],\n\t\"./Sidebar/Sidebar.js\": [\n\t\t\"../../../../src/Components/Sidebar/Sidebar.js\"\n\t],\n\t\"./Sidebar/index\": [\n\t\t\"../../../../src/Components/Sidebar/index.js\"\n\t],\n\t\"./Sidebar/index.js\": [\n\t\t\"../../../../src/Components/Sidebar/index.js\"\n\t]\n};\nfunction webpackAsyncContext(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\treturn Promise.resolve().then(function() {\n\t\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\t\te.code = 'MODULE_NOT_FOUND';\n\t\t\tthrow e;\n\t\t});\n\t}\n\n\tvar ids = map[req], id = ids[0];\n\treturn Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {\n\t\treturn __webpack_require__(id);\n\t});\n}\nwebpackAsyncContext.keys = function webpackAsyncContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackAsyncContext.id = \"../../../../src/Components lazy recursive ^\\\\.\\\\/.*$\";\nmodule.exports = webpackAsyncContext;\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/Components_lazy_^\\.\\/.*$_namespace_object?");

/***/ }),

/***/ "../../../../src/Components/Loading/Loading.js":
/*!******************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/Components/Loading/Loading.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\nvar _jsxFileName = \"C:\\\\Users\\\\luisl\\\\Sites\\\\mui\\\\src\\\\Components\\\\Loading\\\\Loading.js\";\n\n\nconst Loading = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n  __source: {\n    fileName: _jsxFileName,\n    lineNumber: 4\n  }\n}, \"Loading\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Loading);\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/Components/Loading/Loading.js?");

/***/ }),

/***/ "../../../../src/Components/Loading/index.js":
/*!****************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/Components/Loading/index.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Loading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Loading */ \"../../../../src/Components/Loading/Loading.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_Loading__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/Components/Loading/index.js?");

/***/ }),

/***/ "../../../../src/Components/NavigationBar/NavigationBar.js":
/*!******************************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/Components/NavigationBar/NavigationBar.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core/Paper */ \"@material-ui/core/Paper\");\n/* harmony import */ var _material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _material_ui_core_Tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/Tabs */ \"@material-ui/core/Tabs\");\n/* harmony import */ var _material_ui_core_Tabs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Tabs__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _material_ui_core_Tab__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core/Tab */ \"@material-ui/core/Tab\");\n/* harmony import */ var _material_ui_core_Tab__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Tab__WEBPACK_IMPORTED_MODULE_3__);\nvar _jsxFileName = \"C:\\\\Users\\\\luisl\\\\Sites\\\\mui\\\\src\\\\Components\\\\NavigationBar\\\\NavigationBar.js\";\n\n\n\n\n\nfunction NavigationBar({\n  tabs,\n  tabId,\n  setTab\n}) {\n  const [tabIndex, setTabIndex] = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])();\n  Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useEffect\"])(() => {\n    setTabIndex(tabs.map(({\n      id\n    }) => id).indexOf(tabId));\n  }, [tabs, tabId]);\n\n  function handleChange(e, tabId) {\n    setTab(tabs[tabId].id);\n  }\n\n  ;\n  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Paper__WEBPACK_IMPORTED_MODULE_1___default.a, {\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 21\n    }\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Tabs__WEBPACK_IMPORTED_MODULE_2___default.a, {\n    value: tabIndex,\n    onChange: handleChange,\n    indicatorColor: \"primary\",\n    textColor: \"primary\",\n    centered: true,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 22\n    }\n  }, tabs.map(({\n    name\n  }) => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Tab__WEBPACK_IMPORTED_MODULE_3___default.a, {\n    label: name,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 30\n    }\n  })))) // ) : (\n  //   <p>Loading</p>\n  ;\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (NavigationBar);\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/Components/NavigationBar/NavigationBar.js?");

/***/ }),

/***/ "../../../../src/Components/NavigationBar/index.js":
/*!**********************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/Components/NavigationBar/index.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _NavigationBar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NavigationBar */ \"../../../../src/Components/NavigationBar/NavigationBar.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_NavigationBar__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/Components/NavigationBar/index.js?");

/***/ }),

/***/ "../../../../src/Components/NotFound/index.js":
/*!*****************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/Components/NotFound/index.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\nvar _jsxFileName = \"C:\\\\Users\\\\luisl\\\\Sites\\\\mui\\\\src\\\\Components\\\\NotFound\\\\index.js\";\n\n\nconst NotFound = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n  __source: {\n    fileName: _jsxFileName,\n    lineNumber: 4\n  }\n}, \"Page not found.\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (NotFound);\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/Components/NotFound/index.js?");

/***/ }),

/***/ "../../../../src/Components/Sidebar/Sidebar.js":
/*!******************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/Components/Sidebar/Sidebar.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles */ \"@material-ui/core/styles\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _material_ui_core_List__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core/List */ \"@material-ui/core/List\");\n/* harmony import */ var _material_ui_core_List__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_List__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/core/ListItem */ \"@material-ui/core/ListItem\");\n/* harmony import */ var _material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _material_ui_core_Divider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core/Divider */ \"@material-ui/core/Divider\");\n/* harmony import */ var _material_ui_core_Divider__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Divider__WEBPACK_IMPORTED_MODULE_5__);\nvar _jsxFileName = \"C:\\\\Users\\\\luisl\\\\Sites\\\\mui\\\\src\\\\Components\\\\Sidebar\\\\Sidebar.js\";\n\n\n\n\n\n\n\nconst styles = theme => ({\n  root: {\n    width: '100%',\n    maxWidth: '360px',\n    backgroundColor: theme.palette.background.paper\n  }\n});\n\nconst Sidebar = ({\n  classes,\n  menuGroups\n}) => {\n  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_List__WEBPACK_IMPORTED_MODULE_3___default.a, {\n    component: \"nav\",\n    className: classes.root,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 19\n    }\n  }, menuGroups.map(({\n    path,\n    name\n  }, i, xs) => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], {\n    key: i,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 21\n    }\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_4___default.a, {\n    button: true,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 22\n    }\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__[\"Link\"], {\n    to: path,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 23\n    }\n  }, name)), i !== xs.length - 1 && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_Divider__WEBPACK_IMPORTED_MODULE_5___default.a, {\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 25\n    }\n  }))));\n}; // Sidebar.propTypes = {\n//   classes: PropTypes.object.isRequired,\n// };\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__[\"withStyles\"])(styles)(Sidebar));\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/Components/Sidebar/Sidebar.js?");

/***/ }),

/***/ "../../../../src/Components/Sidebar/index.js":
/*!****************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/Components/Sidebar/index.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Sidebar */ \"../../../../src/Components/Sidebar/Sidebar.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_Sidebar__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/Components/Sidebar/index.js?");

/***/ }),

/***/ "../../../../src/Universal.js":
/*!*************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/Universal.js ***!
  \*************************************************/
/*! exports provided: default, loadComponent, universal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loadComponent\", function() { return loadComponent; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ \"prop-types\");\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'react-universal-component'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\nthrow new Error(\"Cannot find module 'react-universal-component'\");\n/* harmony import */ var Components_Loading__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Components/Loading */ \"../../../../src/Components/Loading/index.js\");\n/* harmony import */ var Components_NotFound__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! Components/NotFound */ \"../../../../src/Components/NotFound/index.js\");\n\n\n\n\n // small function that allows page to be a string or a dynamic import function\n// <UniversalComponent page={()=>{import('../../someFolder/Component.js')}}\n// Its great for complex folder structures. You can leverage code completion\n\nconst UniversalComponent = !(function webpackMissingModule() { var e = new Error(\"Cannot find module 'react-universal-component'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(({\n  page\n}) => page(), {\n  onError: error => {\n    throw error;\n  },\n  minDelay: 1200,\n  loading: Components_Loading__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n  error: Components_NotFound__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n  ignoreBabelRename: true\n});\nUniversalComponent.propTypes = {\n  loading: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.element, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool]),\n  error: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.element, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool]),\n  key: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func]),\n  timeout: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n  onError: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,\n  onLoad: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,\n  minDelay: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n  alwaysDelay: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,\n  loadingTransition: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool\n};\n\nconst loadComponent = file => !(function webpackMissingModule() { var e = new Error(\"Cannot find module 'react-universal-component'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(file());\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (UniversalComponent);\n\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/Universal.js?");

/***/ }),

/***/ "../../../../src/routes/Features/Features.js":
/*!****************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/routes/Features/Features.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var Universal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Universal */ \"../../../../src/Universal.js\");\nvar _jsxFileName = \"C:\\\\Users\\\\luisl\\\\Sites\\\\mui\\\\src\\\\routes\\\\Features\\\\Features.js\";\n\nfunction _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }\n\nfunction _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }\n\n\n\n\n\nfunction Features({\n  path,\n  component\n}) {\n  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__[\"Route\"], {\n    path: path,\n    render: (_ref) => {\n      let {\n        staticContext\n      } = _ref,\n          props = _objectWithoutProperties(_ref, [\"staticContext\"]);\n\n      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Universal__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n        page: () => __webpack_require__(\"../../../../src/Components lazy recursive ^\\\\.\\\\/.*$\")(`./${component}`) // onBefore={this.beforeChange}\n        // onAfter={this.afterChange}\n        // onError={this.handleError}\n        ,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 11\n        }\n      });\n    },\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 8\n    }\n  });\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Features);\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/routes/Features/Features.js?");

/***/ }),

/***/ "../../../../src/routes/Features/index.js":
/*!*************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/src/routes/Features/index.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Features__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Features */ \"../../../../src/routes/Features/Features.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_Features__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/routes/Features/index.js?");

/***/ }),

/***/ "../../../isomorphic-style-loader/lib/insertCss.js":
/*!**************************************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/node_modules/isomorphic-style-loader/lib/insertCss.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ \"babel-runtime/core-js/json/stringify\");\n\nvar _stringify2 = _interopRequireDefault(_stringify);\n\nvar _slicedToArray2 = __webpack_require__(/*! babel-runtime/helpers/slicedToArray */ \"babel-runtime/helpers/slicedToArray\");\n\nvar _slicedToArray3 = _interopRequireDefault(_slicedToArray2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n/**\n * Isomorphic CSS style loader for Webpack\n *\n * Copyright © 2015-present Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\nvar prefix = 's';\nvar inserted = {};\n\n// Base64 encoding and decoding - The \"Unicode Problem\"\n// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem\nfunction b64EncodeUnicode(str) {\n  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {\n    return String.fromCharCode('0x' + p1);\n  }));\n}\n\n/**\n * Remove style/link elements for specified node IDs\n * if they are no longer referenced by UI components.\n */\nfunction removeCss(ids) {\n  ids.forEach(function (id) {\n    if (--inserted[id] <= 0) {\n      var elem = document.getElementById(prefix + id);\n      if (elem) {\n        elem.parentNode.removeChild(elem);\n      }\n    }\n  });\n}\n\n/**\n * Example:\n *   // Insert CSS styles object generated by `css-loader` into DOM\n *   var removeCss = insertCss([[1, 'body { color: red; }']]);\n *\n *   // Remove it from the DOM\n *   removeCss();\n */\nfunction insertCss(styles) {\n  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},\n      _ref$replace = _ref.replace,\n      replace = _ref$replace === undefined ? false : _ref$replace,\n      _ref$prepend = _ref.prepend,\n      prepend = _ref$prepend === undefined ? false : _ref$prepend;\n\n  var ids = [];\n  for (var i = 0; i < styles.length; i++) {\n    var _styles$i = (0, _slicedToArray3.default)(styles[i], 4),\n        moduleId = _styles$i[0],\n        css = _styles$i[1],\n        media = _styles$i[2],\n        sourceMap = _styles$i[3];\n\n    var id = moduleId + '-' + i;\n\n    ids.push(id);\n\n    if (inserted[id]) {\n      if (!replace) {\n        inserted[id]++;\n        continue;\n      }\n    }\n\n    inserted[id] = 1;\n\n    var elem = document.getElementById(prefix + id);\n    var create = false;\n\n    if (!elem) {\n      create = true;\n\n      elem = document.createElement('style');\n      elem.setAttribute('type', 'text/css');\n      elem.id = prefix + id;\n\n      if (media) {\n        elem.setAttribute('media', media);\n      }\n    }\n\n    var cssText = css;\n    if (sourceMap && typeof btoa === 'function') {\n      // skip IE9 and below, see http://caniuse.com/atob-btoa\n      cssText += '\\n/*# sourceMappingURL=data:application/json;base64,' + b64EncodeUnicode((0, _stringify2.default)(sourceMap)) + '*/';\n      cssText += '\\n/*# sourceURL=' + sourceMap.file + '?' + id + '*/';\n    }\n\n    if ('textContent' in elem) {\n      elem.textContent = cssText;\n    } else {\n      elem.styleSheet.cssText = cssText;\n    }\n\n    if (create) {\n      if (prepend) {\n        document.head.insertBefore(elem, document.head.childNodes[0]);\n      } else {\n        document.head.appendChild(elem);\n      }\n    }\n  }\n\n  return removeCss.bind(null, ids);\n}\n\nmodule.exports = insertCss;\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/node_modules/isomorphic-style-loader/lib/insertCss.js?");

/***/ }),

/***/ "../../../start-server-webpack-plugin/dist/monitor-loader.js!../../../start-server-webpack-plugin/dist/monitor-loader.js":
/*!*****************************************************************************************************************************************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/node_modules/start-server-webpack-plugin/dist/monitor-loader.js!C:/Users/luisl/Sites/mui/node_modules/start-server-webpack-plugin/dist/monitor-loader.js ***!
  \*****************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("(() => {\n  // Handle hot updates, copied with slight adjustments from webpack/hot/signal.js\n  if (true) {\n    const log = (type, msg) => console[type](`sswp> ${msg}`);\n    // TODO don't show this when sending signal instead of message\n    log('log', 'Handling Hot Module Reloading');\n    var checkForUpdate = function checkForUpdate(fromUpdate) {\n      module.hot.check().then(function (updatedModules) {\n        if (!updatedModules) {\n          if (fromUpdate) log('log', 'Update applied.');else log('warn', 'Cannot find update.');\n          return;\n        }\n\n        return module.hot.apply({\n          ignoreUnaccepted: true,\n          // TODO probably restart\n          onUnaccepted: function onUnaccepted(data) {\n            log('warn', '\\u0007Ignored an update to unaccepted module ' + data.chain.join(' -> '));\n          }\n        }).then(function (renewedModules) {\n          __webpack_require__(/*! webpack/hot/log-apply-result */ \"webpack/hot/log-apply-result\")(updatedModules, renewedModules);\n\n          checkForUpdate(true);\n        });\n      }).catch(function (err) {\n        var status = module.hot.status();\n        if (['abort', 'fail'].indexOf(status) >= 0) {\n          if (process.send) {\n            process.send('SSWP_HMR_FAIL');\n          }\n          log('warn', 'Cannot apply update.');\n          log('warn', '' + err.stack || err.message);\n          log('error', 'Quitting process - will reload on next file change\\u0007\\n\\u0007\\n\\u0007');\n          process.exit(222);\n        } else {\n          log('warn', 'Update failed: ' + err.stack || false);\n        }\n      });\n    };\n\n    process.on('message', function (message) {\n      if (message !== 'SSWP_HMR') return;\n\n      if (module.hot.status() !== 'idle') {\n        log('warn', 'Got signal but currently in ' + module.hot.status() + ' state.');\n        log('warn', 'Need to be in idle state to start hot update.');\n        return;\n      }\n\n      checkForUpdate();\n    });\n  }\n\n  // Tell our plugin we loaded all the code without initially crashing\n  if (process.send) {\n    process.send('SSWP_LOADED');\n  }\n})()\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/node_modules/start-server-webpack-plugin/dist/monitor-loader.js?C:/Users/luisl/Sites/mui/node_modules/start-server-webpack-plugin/dist/monitor-loader.js");

/***/ }),

/***/ "../../node_modules/css-loader/index.js!../../../../src/App.css":
/*!************************************************************************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/node_modules/cra-universal/node_modules/css-loader!C:/Users/luisl/Sites/mui/src/App.css ***!
  \************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../node_modules/cra-universal/node_modules/css-loader/lib/css-base.js */ \"../../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".App {\\n  text-align: center;\\n}\\n\\n.App-logo {\\n  animation: App-logo-spin infinite 20s linear;\\n  height: 40vmin;\\n  pointer-events: none;\\n}\\n\\n.App-header {\\n  background-color: #282c34;\\n  min-height: 100vh;\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n  justify-content: center;\\n  font-size: calc(10px + 2vmin);\\n  color: white;\\n}\\n\\n.App-link {\\n  color: #61dafb;\\n}\\n\\n@keyframes App-logo-spin {\\n  from {\\n    transform: rotate(0deg);\\n  }\\n  to {\\n    transform: rotate(360deg);\\n  }\\n}\\n\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/src/App.css?C:/Users/luisl/Sites/mui/node_modules/cra-universal/node_modules/css-loader");

/***/ }),

/***/ "../../node_modules/css-loader/lib/css-base.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/luisl/Sites/mui/node_modules/cra-universal/node_modules/css-loader/lib/css-base.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\nmodule.exports = function (useSourceMap) {\n  var list = []; // return the list of modules as css string\n\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = cssWithMappingToString(item, useSourceMap);\n\n      if (item[2]) {\n        return \"@media \" + item[2] + \"{\" + content + \"}\";\n      } else {\n        return content;\n      }\n    }).join(\"\");\n  }; // import a list of modules into the list\n\n\n  list.i = function (modules, mediaQuery) {\n    if (typeof modules === \"string\") modules = [[null, modules, \"\"]];\n    var alreadyImportedModules = {};\n\n    for (var i = 0; i < this.length; i++) {\n      var id = this[i][0];\n      if (typeof id === \"number\") alreadyImportedModules[id] = true;\n    }\n\n    for (i = 0; i < modules.length; i++) {\n      var item = modules[i]; // skip already imported module\n      // this implementation is not 100% perfect for weird media query combinations\n      //  when a module is imported multiple times with different media queries.\n      //  I hope this will never occur (Hey this way we have smaller bundles)\n\n      if (typeof item[0] !== \"number\" || !alreadyImportedModules[item[0]]) {\n        if (mediaQuery && !item[2]) {\n          item[2] = mediaQuery;\n        } else if (mediaQuery) {\n          item[2] = \"(\" + item[2] + \") and (\" + mediaQuery + \")\";\n        }\n\n        list.push(item);\n      }\n    }\n  };\n\n  return list;\n};\n\nfunction cssWithMappingToString(item, useSourceMap) {\n  var content = item[1] || '';\n  var cssMapping = item[3];\n\n  if (!cssMapping) {\n    return content;\n  }\n\n  if (useSourceMap && typeof btoa === 'function') {\n    var sourceMapping = toComment(cssMapping);\n    var sourceURLs = cssMapping.sources.map(function (source) {\n      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';\n    });\n    return [content].concat(sourceURLs).concat([sourceMapping]).join('\\n');\n  }\n\n  return [content].join('\\n');\n} // Adapted from convert-source-map (MIT)\n\n\nfunction toComment(sourceMap) {\n  // eslint-disable-next-line no-undef\n  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));\n  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;\n  return '/*# ' + data + ' */';\n}\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/node_modules/cra-universal/node_modules/css-loader/lib/css-base.js?");

/***/ }),

/***/ "./server/app.js":
/*!***********************!*\
  !*** ./server/app.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _cra_express_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cra-express/core */ \"@cra-express/core\");\n/* harmony import */ var _cra_express_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cra_express_core__WEBPACK_IMPORTED_MODULE_0__);\nvar _jsxFileName = \"C:\\\\Users\\\\luisl\\\\Sites\\\\mui\\\\node_modules\\\\cra-universal\\\\src\\\\config\\\\server\\\\app.js\";\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst React = __webpack_require__(/*! react */ \"react\");\n\n\n\nconst {\n  default: App\n} = __webpack_require__(/*! appbase/src/App */ \"../../../../src/App.js\");\n\nconst clientBuildPath = path.resolve(__dirname, '../client');\nlet AppEl = App;\nconst app = Object(_cra_express_core__WEBPACK_IMPORTED_MODULE_0__[\"createReactAppExpress\"])({\n  clientBuildPath,\n  universalRender: () => React.createElement(AppEl, {\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 13\n    }\n  })\n});\n\nif (true) {\n  module.hot.accept(/*! appbase/src/App */ \"../../../../src/App.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (() => {\n    const {\n      default: App\n    } = __webpack_require__(/*! appbase/src/App */ \"../../../../src/App.js\");\n\n    AppEl = App;\n    console.log('✅ Server hot reloaded App');\n  })(__WEBPACK_OUTDATED_DEPENDENCIES__); }.bind(this));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (app);\n\n//# sourceURL=webpack:///./server/app.js?");

/***/ }),

/***/ "./server/index.js":
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const app = __webpack_require__(/*! ./app */ \"./server/app.js\").default;\n\nconst PORT = process.env.CRA_SERVER_PORT || 3001;\napp.listen(PORT, () => {\n  console.log(`CRA Server Default listening on port ${PORT}!`);\n});\n\n//# sourceURL=webpack:///./server/index.js?");

/***/ }),

/***/ 0:
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** multi ./server/index.js !C:/Users/luisl/Sites/mui/node_modules/start-server-webpack-plugin/dist/monitor-loader.js!C:/Users/luisl/Sites/mui/node_modules/start-server-webpack-plugin/dist/monitor-loader.js ***!
  \******************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./server/index.js */\"./server/index.js\");\nmodule.exports = __webpack_require__(/*! !!C:\\Users\\luisl\\Sites\\mui\\node_modules\\start-server-webpack-plugin\\dist\\monitor-loader.js!C:\\Users\\luisl\\Sites\\mui\\node_modules\\start-server-webpack-plugin\\dist\\monitor-loader.js */\"../../../start-server-webpack-plugin/dist/monitor-loader.js!../../../start-server-webpack-plugin/dist/monitor-loader.js\");\n\n\n//# sourceURL=webpack:///C:/Users/luisl/Sites/mui/node_modules/start-server-webpack-plugin/dist/monitor-loader.js?multi_./server/index.js_!C:/Users/luisl/Sites/mui/node_modules/start-server-webpack-plugin/dist/monitor-loader.js");

/***/ }),

/***/ "@cra-express/core":
/*!************************************!*\
  !*** external "@cra-express/core" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@cra-express/core\");\n\n//# sourceURL=webpack:///external_%22@cra-express/core%22?");

/***/ }),

/***/ "@material-ui/core/Divider":
/*!********************************************!*\
  !*** external "@material-ui/core/Divider" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Divider\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Divider%22?");

/***/ }),

/***/ "@material-ui/core/List":
/*!*****************************************!*\
  !*** external "@material-ui/core/List" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/List\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/List%22?");

/***/ }),

/***/ "@material-ui/core/ListItem":
/*!*********************************************!*\
  !*** external "@material-ui/core/ListItem" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/ListItem\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/ListItem%22?");

/***/ }),

/***/ "@material-ui/core/Paper":
/*!******************************************!*\
  !*** external "@material-ui/core/Paper" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Paper\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Paper%22?");

/***/ }),

/***/ "@material-ui/core/Tab":
/*!****************************************!*\
  !*** external "@material-ui/core/Tab" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Tab\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Tab%22?");

/***/ }),

/***/ "@material-ui/core/Tabs":
/*!*****************************************!*\
  !*** external "@material-ui/core/Tabs" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/Tabs\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/Tabs%22?");

/***/ }),

/***/ "@material-ui/core/styles":
/*!*******************************************!*\
  !*** external "@material-ui/core/styles" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/styles\");\n\n//# sourceURL=webpack:///external_%22@material-ui/core/styles%22?");

/***/ }),

/***/ "babel-runtime/core-js/json/stringify":
/*!*******************************************************!*\
  !*** external "babel-runtime/core-js/json/stringify" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"babel-runtime/core-js/json/stringify\");\n\n//# sourceURL=webpack:///external_%22babel-runtime/core-js/json/stringify%22?");

/***/ }),

/***/ "babel-runtime/helpers/slicedToArray":
/*!******************************************************!*\
  !*** external "babel-runtime/helpers/slicedToArray" ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"babel-runtime/helpers/slicedToArray\");\n\n//# sourceURL=webpack:///external_%22babel-runtime/helpers/slicedToArray%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "prop-types":
/*!*****************************!*\
  !*** external "prop-types" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"prop-types\");\n\n//# sourceURL=webpack:///external_%22prop-types%22?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");\n\n//# sourceURL=webpack:///external_%22react%22?");

/***/ }),

/***/ "react-router-dom":
/*!***********************************!*\
  !*** external "react-router-dom" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-router-dom\");\n\n//# sourceURL=webpack:///external_%22react-router-dom%22?");

/***/ }),

/***/ "webpack/hot/log-apply-result":
/*!***********************************************!*\
  !*** external "webpack/hot/log-apply-result" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack/hot/log-apply-result\");\n\n//# sourceURL=webpack:///external_%22webpack/hot/log-apply-result%22?");

/***/ })

/******/ });