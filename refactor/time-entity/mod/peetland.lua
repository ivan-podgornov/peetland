--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]

local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file, ...)
    if ____moduleCache[file] then
        return ____moduleCache[file].value
    end
    if ____modules[file] then
        local module = ____modules[file]
        local value = nil
        if (select("#", ...) > 0) then value = module(...) else value = module(file) end
        ____moduleCache[file] = { value = value }
        return value
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["lualib_bundle"] = function(...) 
local function __TS__ArrayAt(self, relativeIndex)
    local absoluteIndex = relativeIndex < 0 and #self + relativeIndex or relativeIndex
    if absoluteIndex >= 0 and absoluteIndex < #self then
        return self[absoluteIndex + 1]
    end
    return nil
end

local function __TS__ArrayIsArray(value)
    return type(value) == "table" and (value[1] ~= nil or next(value) == nil)
end

local function __TS__ArrayConcat(self, ...)
    local items = {...}
    local result = {}
    local len = 0
    for i = 1, #self do
        len = len + 1
        result[len] = self[i]
    end
    for i = 1, #items do
        local item = items[i]
        if __TS__ArrayIsArray(item) then
            for j = 1, #item do
                len = len + 1
                result[len] = item[j]
            end
        else
            len = len + 1
            result[len] = item
        end
    end
    return result
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        asyncDispose = __TS__Symbol("Symbol.asyncDispose"),
        dispose = __TS__Symbol("Symbol.dispose"),
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local function __TS__ArrayEntries(array)
    local key = 0
    return {
        [Symbol.iterator] = function(self)
            return self
        end,
        next = function(self)
            local result = {done = array[key + 1] == nil, value = {key, array[key + 1]}}
            key = key + 1
            return result
        end
    }
end

local function __TS__ArrayEvery(self, callbackfn, thisArg)
    for i = 1, #self do
        if not callbackfn(thisArg, self[i], i - 1, self) then
            return false
        end
    end
    return true
end

local function __TS__ArrayFill(self, value, start, ____end)
    local relativeStart = start or 0
    local relativeEnd = ____end or #self
    if relativeStart < 0 then
        relativeStart = relativeStart + #self
    end
    if relativeEnd < 0 then
        relativeEnd = relativeEnd + #self
    end
    do
        local i = relativeStart
        while i < relativeEnd do
            self[i + 1] = value
            i = i + 1
        end
    end
    return self
end

local function __TS__ArrayFilter(self, callbackfn, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            len = len + 1
            result[len] = self[i]
        end
    end
    return result
end

local function __TS__ArrayForEach(self, callbackFn, thisArg)
    for i = 1, #self do
        callbackFn(thisArg, self[i], i - 1, self)
    end
end

local function __TS__ArrayFind(self, predicate, thisArg)
    for i = 1, #self do
        local elem = self[i]
        if predicate(thisArg, elem, i - 1, self) then
            return elem
        end
    end
    return nil
end

local function __TS__ArrayFindIndex(self, callbackFn, thisArg)
    for i = 1, #self do
        if callbackFn(thisArg, self[i], i - 1, self) then
            return i - 1
        end
    end
    return -1
end

local __TS__Iterator
do
    local function iteratorGeneratorStep(self)
        local co = self.____coroutine
        local status, value = coroutine.resume(co)
        if not status then
            error(value, 0)
        end
        if coroutine.status(co) == "dead" then
            return
        end
        return true, value
    end
    local function iteratorIteratorStep(self)
        local result = self:next()
        if result.done then
            return
        end
        return true, result.value
    end
    local function iteratorStringStep(self, index)
        index = index + 1
        if index > #self then
            return
        end
        return index, string.sub(self, index, index)
    end
    function __TS__Iterator(iterable)
        if type(iterable) == "string" then
            return iteratorStringStep, iterable, 0
        elseif iterable.____coroutine ~= nil then
            return iteratorGeneratorStep, iterable
        elseif iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            return iteratorIteratorStep, iterator
        else
            return ipairs(iterable)
        end
    end
end

local __TS__ArrayFrom
do
    local function arrayLikeStep(self, index)
        index = index + 1
        if index > self.length then
            return
        end
        return index, self[index]
    end
    local function arrayLikeIterator(arr)
        if type(arr.length) == "number" then
            return arrayLikeStep, arr, 0
        end
        return __TS__Iterator(arr)
    end
    function __TS__ArrayFrom(arrayLike, mapFn, thisArg)
        local result = {}
        if mapFn == nil then
            for ____, v in arrayLikeIterator(arrayLike) do
                result[#result + 1] = v
            end
        else
            local i = 0
            for ____, v in arrayLikeIterator(arrayLike) do
                local ____mapFn_3 = mapFn
                local ____thisArg_1 = thisArg
                local ____v_2 = v
                local ____i_0 = i
                i = ____i_0 + 1
                result[#result + 1] = ____mapFn_3(____thisArg_1, ____v_2, ____i_0)
            end
        end
        return result
    end
end

local function __TS__ArrayIncludes(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    local k = fromIndex
    if fromIndex < 0 then
        k = len + fromIndex
    end
    if k < 0 then
        k = 0
    end
    for i = k + 1, len do
        if self[i] == searchElement then
            return true
        end
    end
    return false
end

local function __TS__ArrayIndexOf(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    if len == 0 then
        return -1
    end
    if fromIndex >= len then
        return -1
    end
    if fromIndex < 0 then
        fromIndex = len + fromIndex
        if fromIndex < 0 then
            fromIndex = 0
        end
    end
    for i = fromIndex + 1, len do
        if self[i] == searchElement then
            return i - 1
        end
    end
    return -1
end

local function __TS__ArrayJoin(self, separator)
    if separator == nil then
        separator = ","
    end
    local parts = {}
    for i = 1, #self do
        parts[i] = tostring(self[i])
    end
    return table.concat(parts, separator)
end

local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
end

local function __TS__ArrayPush(self, ...)
    local items = {...}
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end

local function __TS__ArrayPushArray(self, items)
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end

local function __TS__CountVarargs(...)
    return select("#", ...)
end

local function __TS__ArrayReduce(self, callbackFn, ...)
    local len = #self
    local k = 0
    local accumulator = nil
    if __TS__CountVarargs(...) ~= 0 then
        accumulator = ...
    elseif len > 0 then
        accumulator = self[1]
        k = 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k + 1, len do
        accumulator = callbackFn(
            nil,
            accumulator,
            self[i],
            i - 1,
            self
        )
    end
    return accumulator
end

local function __TS__ArrayReduceRight(self, callbackFn, ...)
    local len = #self
    local k = len - 1
    local accumulator = nil
    if __TS__CountVarargs(...) ~= 0 then
        accumulator = ...
    elseif len > 0 then
        accumulator = self[k + 1]
        k = k - 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k + 1, 1, -1 do
        accumulator = callbackFn(
            nil,
            accumulator,
            self[i],
            i - 1,
            self
        )
    end
    return accumulator
end

local function __TS__ArrayReverse(self)
    local i = 1
    local j = #self
    while i < j do
        local temp = self[j]
        self[j] = self[i]
        self[i] = temp
        i = i + 1
        j = j - 1
    end
    return self
end

local function __TS__ArrayUnshift(self, ...)
    local items = {...}
    local numItemsToInsert = #items
    if numItemsToInsert == 0 then
        return #self
    end
    for i = #self, 1, -1 do
        self[i + numItemsToInsert] = self[i]
    end
    for i = 1, numItemsToInsert do
        self[i] = items[i]
    end
    return #self
end

local function __TS__ArraySort(self, compareFn)
    if compareFn ~= nil then
        table.sort(
            self,
            function(a, b) return compareFn(nil, a, b) < 0 end
        )
    else
        table.sort(self)
    end
    return self
end

local function __TS__ArraySlice(self, first, last)
    local len = #self
    first = first or 0
    if first < 0 then
        first = len + first
        if first < 0 then
            first = 0
        end
    else
        if first > len then
            first = len
        end
    end
    last = last or len
    if last < 0 then
        last = len + last
        if last < 0 then
            last = 0
        end
    else
        if last > len then
            last = len
        end
    end
    local out = {}
    first = first + 1
    last = last + 1
    local n = 1
    while first < last do
        out[n] = self[first]
        first = first + 1
        n = n + 1
    end
    return out
end

local function __TS__ArraySome(self, callbackfn, thisArg)
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            return true
        end
    end
    return false
end

local function __TS__ArraySplice(self, ...)
    local args = {...}
    local len = #self
    local actualArgumentCount = __TS__CountVarargs(...)
    local start = args[1]
    local deleteCount = args[2]
    if start < 0 then
        start = len + start
        if start < 0 then
            start = 0
        end
    elseif start > len then
        start = len
    end
    local itemCount = actualArgumentCount - 2
    if itemCount < 0 then
        itemCount = 0
    end
    local actualDeleteCount
    if actualArgumentCount == 0 then
        actualDeleteCount = 0
    elseif actualArgumentCount == 1 then
        actualDeleteCount = len - start
    else
        actualDeleteCount = deleteCount or 0
        if actualDeleteCount < 0 then
            actualDeleteCount = 0
        end
        if actualDeleteCount > len - start then
            actualDeleteCount = len - start
        end
    end
    local out = {}
    for k = 1, actualDeleteCount do
        local from = start + k
        if self[from] ~= nil then
            out[k] = self[from]
        end
    end
    if itemCount < actualDeleteCount then
        for k = start + 1, len - actualDeleteCount do
            local from = k + actualDeleteCount
            local to = k + itemCount
            if self[from] then
                self[to] = self[from]
            else
                self[to] = nil
            end
        end
        for k = len - actualDeleteCount + itemCount + 1, len do
            self[k] = nil
        end
    elseif itemCount > actualDeleteCount then
        for k = len - actualDeleteCount, start + 1, -1 do
            local from = k + actualDeleteCount
            local to = k + itemCount
            if self[from] then
                self[to] = self[from]
            else
                self[to] = nil
            end
        end
    end
    local j = start + 1
    for i = 3, actualArgumentCount do
        self[j] = args[i]
        j = j + 1
    end
    for k = #self, len - actualDeleteCount + itemCount + 1, -1 do
        self[k] = nil
    end
    return out
end

local function __TS__ArrayToObject(self)
    local object = {}
    for i = 1, #self do
        object[i - 1] = self[i]
    end
    return object
end

local function __TS__ArrayFlat(self, depth)
    if depth == nil then
        depth = 1
    end
    local result = {}
    local len = 0
    for i = 1, #self do
        local value = self[i]
        if depth > 0 and __TS__ArrayIsArray(value) then
            local toAdd
            if depth == 1 then
                toAdd = value
            else
                toAdd = __TS__ArrayFlat(value, depth - 1)
            end
            for j = 1, #toAdd do
                local val = toAdd[j]
                len = len + 1
                result[len] = val
            end
        else
            len = len + 1
            result[len] = value
        end
    end
    return result
end

local function __TS__ArrayFlatMap(self, callback, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        local value = callback(thisArg, self[i], i - 1, self)
        if __TS__ArrayIsArray(value) then
            for j = 1, #value do
                len = len + 1
                result[len] = value[j]
            end
        else
            len = len + 1
            result[len] = value
        end
    end
    return result
end

local function __TS__ArraySetLength(self, length)
    if length < 0 or length ~= length or length == math.huge or math.floor(length) ~= length then
        error(
            "invalid array length: " .. tostring(length),
            0
        )
    end
    for i = length + 1, #self do
        self[i] = nil
    end
    return length
end

local __TS__Unpack = table.unpack or unpack

local function __TS__ArrayToReversed(self)
    local copy = {__TS__Unpack(self)}
    __TS__ArrayReverse(copy)
    return copy
end

local function __TS__ArrayToSorted(self, compareFn)
    local copy = {__TS__Unpack(self)}
    __TS__ArraySort(copy, compareFn)
    return copy
end

local function __TS__ArrayToSpliced(self, start, deleteCount, ...)
    local copy = {__TS__Unpack(self)}
    __TS__ArraySplice(copy, start, deleteCount, ...)
    return copy
end

local function __TS__ArrayWith(self, index, value)
    local copy = {__TS__Unpack(self)}
    copy[index + 1] = value
    return copy
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not not classTbl[Symbol.hasInstance](classTbl, obj)
    end
    if type(obj) == "table" then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local __TS__Promise
do
    local function makeDeferredPromiseFactory()
        local resolve
        local reject
        local function executor(____, res, rej)
            resolve = res
            reject = rej
        end
        return function()
            local promise = __TS__New(__TS__Promise, executor)
            return promise, resolve, reject
        end
    end
    local makeDeferredPromise = makeDeferredPromiseFactory()
    local function isPromiseLike(value)
        return __TS__InstanceOf(value, __TS__Promise)
    end
    local function doNothing(self)
    end
    local ____pcall = _G.pcall
    __TS__Promise = __TS__Class()
    __TS__Promise.name = "__TS__Promise"
    function __TS__Promise.prototype.____constructor(self, executor)
        self.state = 0
        self.fulfilledCallbacks = {}
        self.rejectedCallbacks = {}
        local success, ____error = ____pcall(
            executor,
            nil,
            function(____, v) return self:resolve(v) end,
            function(____, err) return self:reject(err) end
        )
        if not success then
            self:reject(____error)
        end
    end
    function __TS__Promise.resolve(value)
        if __TS__InstanceOf(value, __TS__Promise) then
            return value
        end
        local promise = __TS__New(__TS__Promise, doNothing)
        promise.state = 1
        promise.value = value
        return promise
    end
    function __TS__Promise.reject(reason)
        local promise = __TS__New(__TS__Promise, doNothing)
        promise.state = 2
        promise.rejectionReason = reason
        return promise
    end
    __TS__Promise.prototype["then"] = function(self, onFulfilled, onRejected)
        local promise, resolve, reject = makeDeferredPromise()
        self:addCallbacks(
            onFulfilled and self:createPromiseResolvingCallback(onFulfilled, resolve, reject) or resolve,
            onRejected and self:createPromiseResolvingCallback(onRejected, resolve, reject) or reject
        )
        return promise
    end
    function __TS__Promise.prototype.addCallbacks(self, fulfilledCallback, rejectedCallback)
        if self.state == 1 then
            return fulfilledCallback(nil, self.value)
        end
        if self.state == 2 then
            return rejectedCallback(nil, self.rejectionReason)
        end
        local ____self_fulfilledCallbacks_0 = self.fulfilledCallbacks
        ____self_fulfilledCallbacks_0[#____self_fulfilledCallbacks_0 + 1] = fulfilledCallback
        local ____self_rejectedCallbacks_1 = self.rejectedCallbacks
        ____self_rejectedCallbacks_1[#____self_rejectedCallbacks_1 + 1] = rejectedCallback
    end
    function __TS__Promise.prototype.catch(self, onRejected)
        return self["then"](self, nil, onRejected)
    end
    function __TS__Promise.prototype.finally(self, onFinally)
        if type(onFinally) ~= "function" then
            return self["then"](self, onFinally, onFinally)
        end
        return self["then"](
            self,
            function(____, x)
                local ____self_2 = __TS__New(
                    __TS__Promise,
                    function(____, resolve) return resolve(
                        nil,
                        onFinally(nil)
                    ) end
                )
                return ____self_2["then"](
                    ____self_2,
                    function() return x end
                )
            end,
            function(____, e)
                local ____self_3 = __TS__New(
                    __TS__Promise,
                    function(____, resolve) return resolve(
                        nil,
                        onFinally(nil)
                    ) end
                )
                return ____self_3["then"](
                    ____self_3,
                    function()
                        error(e, 0)
                    end
                )
            end
        )
    end
    function __TS__Promise.prototype.resolve(self, value)
        if isPromiseLike(value) then
            return value:addCallbacks(
                function(____, v) return self:resolve(v) end,
                function(____, err) return self:reject(err) end
            )
        end
        if self.state == 0 then
            self.state = 1
            self.value = value
            return self:invokeCallbacks(self.fulfilledCallbacks, value)
        end
    end
    function __TS__Promise.prototype.reject(self, reason)
        if self.state == 0 then
            self.state = 2
            self.rejectionReason = reason
            return self:invokeCallbacks(self.rejectedCallbacks, reason)
        end
    end
    function __TS__Promise.prototype.invokeCallbacks(self, callbacks, value)
        local callbacksLength = #callbacks
        if callbacksLength ~= 0 then
            for i = 1, callbacksLength - 1 do
                callbacks[i](callbacks, value)
            end
            return callbacks[callbacksLength](callbacks, value)
        end
    end
    function __TS__Promise.prototype.createPromiseResolvingCallback(self, f, resolve, reject)
        return function(____, value)
            local success, resultOrError = ____pcall(f, nil, value)
            if not success then
                return reject(nil, resultOrError)
            end
            return self:handleCallbackValue(resultOrError, resolve, reject)
        end
    end
    function __TS__Promise.prototype.handleCallbackValue(self, value, resolve, reject)
        if isPromiseLike(value) then
            local nextpromise = value
            if nextpromise.state == 1 then
                return resolve(nil, nextpromise.value)
            elseif nextpromise.state == 2 then
                return reject(nil, nextpromise.rejectionReason)
            else
                return nextpromise:addCallbacks(resolve, reject)
            end
        else
            return resolve(nil, value)
        end
    end
end

local __TS__AsyncAwaiter, __TS__Await
do
    local ____coroutine = _G.coroutine or ({})
    local cocreate = ____coroutine.create
    local coresume = ____coroutine.resume
    local costatus = ____coroutine.status
    local coyield = ____coroutine.yield
    function __TS__AsyncAwaiter(generator)
        return __TS__New(
            __TS__Promise,
            function(____, resolve, reject)
                local fulfilled, step, resolved, asyncCoroutine
                function fulfilled(self, value)
                    local success, resultOrError = coresume(asyncCoroutine, value)
                    if success then
                        return step(resultOrError)
                    end
                    return reject(nil, resultOrError)
                end
                function step(result)
                    if resolved then
                        return
                    end
                    if costatus(asyncCoroutine) == "dead" then
                        return resolve(nil, result)
                    end
                    return __TS__Promise.resolve(result):addCallbacks(fulfilled, reject)
                end
                resolved = false
                asyncCoroutine = cocreate(generator)
                local success, resultOrError = coresume(
                    asyncCoroutine,
                    function(____, v)
                        resolved = true
                        return __TS__Promise.resolve(v):addCallbacks(resolve, reject)
                    end
                )
                if success then
                    return step(resultOrError)
                else
                    return reject(nil, resultOrError)
                end
            end
        )
    end
    function __TS__Await(thing)
        return coyield(thing)
    end
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local function __TS__Decorate(self, originalValue, decorators, context)
    local result = originalValue
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator ~= nil then
                local ____decorator_result_0 = decorator(self, result, context)
                if ____decorator_result_0 == nil then
                    ____decorator_result_0 = result
                end
                result = ____decorator_result_0
            end
            i = i - 1
        end
    end
    return result
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        if type(source) == "table" then
            for key in pairs(source) do
                target[key] = source[key]
            end
        end
    end
    return target
end

local function __TS__ObjectGetOwnPropertyDescriptor(object, key)
    local metatable = getmetatable(object)
    if not metatable then
        return
    end
    if not rawget(metatable, "_descriptors") then
        return
    end
    return rawget(metatable, "_descriptors")[key]
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        if not isPrototype and not rawget(metatable, "_isOwnDescriptorMetatable") then
            local instanceMetatable = {}
            instanceMetatable._isOwnDescriptorMetatable = true
            setmetatable(instanceMetatable, metatable)
            setmetatable(target, instanceMetatable)
            metatable = instanceMetatable
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end

local function __TS__DecorateLegacy(decorators, target, key, desc)
    local result = target
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator ~= nil then
                local oldResult = result
                if key == nil then
                    result = decorator(nil, result)
                elseif desc == true then
                    local value = rawget(target, key)
                    local descriptor = __TS__ObjectGetOwnPropertyDescriptor(target, key) or ({configurable = true, writable = true, value = value})
                    local desc = decorator(nil, target, key, descriptor) or descriptor
                    local isSimpleValue = desc.configurable == true and desc.writable == true and not desc.get and not desc.set
                    if isSimpleValue then
                        rawset(target, key, desc.value)
                    else
                        __TS__SetDescriptor(
                            target,
                            key,
                            __TS__ObjectAssign({}, descriptor, desc)
                        )
                    end
                elseif desc == false then
                    result = decorator(nil, target, key, desc)
                else
                    result = decorator(nil, target, key)
                end
                result = result or oldResult
            end
            i = i - 1
        end
    end
    return result
end

local function __TS__DecorateParam(paramIndex, decorator)
    return function(____, target, key) return decorator(nil, target, key, paramIndex) end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectGetOwnPropertyDescriptors(object)
    local metatable = getmetatable(object)
    if not metatable then
        return {}
    end
    return rawget(metatable, "_descriptors") or ({})
end

local function __TS__Delete(target, key)
    local descriptors = __TS__ObjectGetOwnPropertyDescriptors(target)
    local descriptor = descriptors[key]
    if descriptor then
        if not descriptor.configurable then
            error(
                __TS__New(
                    TypeError,
                    ((("Cannot delete property " .. tostring(key)) .. " of ") .. tostring(target)) .. "."
                ),
                0
            )
        end
        descriptors[key] = nil
        return true
    end
    target[key] = nil
    return true
end

local function __TS__StringAccess(self, index)
    if index >= 0 and index < #self then
        return string.sub(self, index + 1, index + 1)
    end
end

local function __TS__DelegatedYield(iterable)
    if type(iterable) == "string" then
        for index = 0, #iterable - 1 do
            coroutine.yield(__TS__StringAccess(iterable, index))
        end
    elseif iterable.____coroutine ~= nil then
        local co = iterable.____coroutine
        while true do
            local status, value = coroutine.resume(co)
            if not status then
                error(value, 0)
            end
            if coroutine.status(co) == "dead" then
                return value
            else
                coroutine.yield(value)
            end
        end
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                return result.value
            else
                coroutine.yield(result.value)
            end
        end
    else
        for ____, value in ipairs(iterable) do
            coroutine.yield(value)
        end
    end
end

local function __TS__FunctionBind(fn, ...)
    local boundArgs = {...}
    return function(____, ...)
        local args = {...}
        __TS__ArrayUnshift(
            args,
            __TS__Unpack(boundArgs)
        )
        return fn(__TS__Unpack(args))
    end
end

local __TS__Generator
do
    local function generatorIterator(self)
        return self
    end
    local function generatorNext(self, ...)
        local co = self.____coroutine
        if coroutine.status(co) == "dead" then
            return {done = true}
        end
        local status, value = coroutine.resume(co, ...)
        if not status then
            error(value, 0)
        end
        return {
            value = value,
            done = coroutine.status(co) == "dead"
        }
    end
    function __TS__Generator(fn)
        return function(...)
            local args = {...}
            local argsLength = __TS__CountVarargs(...)
            return {
                ____coroutine = coroutine.create(function() return fn(__TS__Unpack(args, 1, argsLength)) end),
                [Symbol.iterator] = generatorIterator,
                next = generatorNext
            }
        end
    end
end

local function __TS__InstanceOfObject(value)
    local valueType = type(value)
    return valueType == "table" or valueType == "function"
end

local function __TS__LuaIteratorSpread(self, state, firstKey)
    local results = {}
    local key, value = self(state, firstKey)
    while key do
        results[#results + 1] = {key, value}
        key, value = self(state, key)
    end
    return __TS__Unpack(results)
end

local Map
do
    Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next ~= nil and previous ~= nil then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next ~= nil then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous ~= nil then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, self.items[key], key, self)
        end
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return self.nextKey[key] ~= nil or self.lastKey == key
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local function getFirstKey()
            return self.firstKey
        end
        local items = self.items
        local nextKey = self.nextKey
        local key
        local started = false
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                if not started then
                    started = true
                    key = getFirstKey(nil)
                else
                    key = nextKey[key]
                end
                return {done = not key, value = {key, items[key]}}
            end
        }
    end
    function Map.prototype.keys(self)
        local function getFirstKey()
            return self.firstKey
        end
        local nextKey = self.nextKey
        local key
        local started = false
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                if not started then
                    started = true
                    key = getFirstKey(nil)
                else
                    key = nextKey[key]
                end
                return {done = not key, value = key}
            end
        }
    end
    function Map.prototype.values(self)
        local function getFirstKey()
            return self.firstKey
        end
        local items = self.items
        local nextKey = self.nextKey
        local key
        local started = false
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                if not started then
                    started = true
                    key = getFirstKey(nil)
                else
                    key = nextKey[key]
                end
                return {done = not key, value = items[key]}
            end
        }
    end
    Map[Symbol.species] = Map
end

local function __TS__MapGroupBy(items, keySelector)
    local result = __TS__New(Map)
    local i = 0
    for ____, item in __TS__Iterator(items) do
        local key = keySelector(nil, item, i)
        if result:has(key) then
            local ____temp_0 = result:get(key)
            ____temp_0[#____temp_0 + 1] = item
        else
            result:set(key, {item})
        end
        i = i + 1
    end
    return result
end

local __TS__Match = string.match

local __TS__MathAtan2 = math.atan2 or math.atan

local __TS__MathModf = math.modf

local function __TS__NumberIsNaN(value)
    return value ~= value
end

local function __TS__MathSign(val)
    if __TS__NumberIsNaN(val) or val == 0 then
        return val
    end
    if val < 0 then
        return -1
    end
    return 1
end

local function __TS__NumberIsFinite(value)
    return type(value) == "number" and value == value and value ~= math.huge and value ~= -math.huge
end

local function __TS__MathTrunc(val)
    if not __TS__NumberIsFinite(val) or val == 0 then
        return val
    end
    return val > 0 and math.floor(val) or math.ceil(val)
end

local function __TS__Number(value)
    local valueType = type(value)
    if valueType == "number" then
        return value
    elseif valueType == "string" then
        local numberValue = tonumber(value)
        if numberValue then
            return numberValue
        end
        if value == "Infinity" then
            return math.huge
        end
        if value == "-Infinity" then
            return -math.huge
        end
        local stringWithoutSpaces = string.gsub(value, "%s", "")
        if stringWithoutSpaces == "" then
            return 0
        end
        return 0 / 0
    elseif valueType == "boolean" then
        return value and 1 or 0
    else
        return 0 / 0
    end
end

local function __TS__NumberIsInteger(value)
    return __TS__NumberIsFinite(value) and math.floor(value) == value
end

local function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if ____end ~= nil and start > ____end then
        start, ____end = ____end, start
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

local __TS__ParseInt
do
    local parseIntBasePattern = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTvVwWxXyYzZ"
    function __TS__ParseInt(numberString, base)
        if base == nil then
            base = 10
            local hexMatch = __TS__Match(numberString, "^%s*-?0[xX]")
            if hexMatch ~= nil then
                base = 16
                numberString = (__TS__Match(hexMatch, "-")) and "-" .. __TS__StringSubstring(numberString, #hexMatch) or __TS__StringSubstring(numberString, #hexMatch)
            end
        end
        if base < 2 or base > 36 then
            return 0 / 0
        end
        local allowedDigits = base <= 10 and __TS__StringSubstring(parseIntBasePattern, 0, base) or __TS__StringSubstring(parseIntBasePattern, 0, 10 + 2 * (base - 10))
        local pattern = ("^%s*(-?[" .. allowedDigits) .. "]*)"
        local number = tonumber((__TS__Match(numberString, pattern)), base)
        if number == nil then
            return 0 / 0
        end
        if number >= 0 then
            return math.floor(number)
        else
            return math.ceil(number)
        end
    end
end

local function __TS__ParseFloat(numberString)
    local infinityMatch = __TS__Match(numberString, "^%s*(-?Infinity)")
    if infinityMatch ~= nil then
        return __TS__StringAccess(infinityMatch, 0) == "-" and -math.huge or math.huge
    end
    local number = tonumber((__TS__Match(numberString, "^%s*(-?%d+%.?%d*)")))
    return number or 0 / 0
end

local __TS__NumberToString
do
    local radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
    function __TS__NumberToString(self, radix)
        if radix == nil or radix == 10 or self == math.huge or self == -math.huge or self ~= self then
            return tostring(self)
        end
        radix = math.floor(radix)
        if radix < 2 or radix > 36 then
            error("toString() radix argument must be between 2 and 36", 0)
        end
        local integer, fraction = __TS__MathModf(math.abs(self))
        local result = ""
        if radix == 8 then
            result = string.format("%o", integer)
        elseif radix == 16 then
            result = string.format("%x", integer)
        else
            repeat
                do
                    result = __TS__StringAccess(radixChars, integer % radix) .. result
                    integer = math.floor(integer / radix)
                end
            until not (integer ~= 0)
        end
        if fraction ~= 0 then
            result = result .. "."
            local delta = 1e-16
            repeat
                do
                    fraction = fraction * radix
                    delta = delta * radix
                    local digit = math.floor(fraction)
                    result = result .. __TS__StringAccess(radixChars, digit)
                    fraction = fraction - digit
                end
            until not (fraction >= delta)
        end
        if self < 0 then
            result = "-" .. result
        end
        return result
    end
end

local function __TS__NumberToFixed(self, fractionDigits)
    if math.abs(self) >= 1e+21 or self ~= self then
        return tostring(self)
    end
    local f = math.floor(fractionDigits or 0)
    if f < 0 or f > 99 then
        error("toFixed() digits argument must be between 0 and 99", 0)
    end
    return string.format(
        ("%." .. tostring(f)) .. "f",
        self
    )
end

local function __TS__ObjectDefineProperty(target, key, desc)
    local luaKey = type(key) == "number" and key + 1 or key
    local value = rawget(target, luaKey)
    local hasGetterOrSetter = desc.get ~= nil or desc.set ~= nil
    local descriptor
    if hasGetterOrSetter then
        if value ~= nil then
            error(
                "Cannot redefine property: " .. tostring(key),
                0
            )
        end
        descriptor = desc
    else
        local valueExists = value ~= nil
        local ____desc_set_4 = desc.set
        local ____desc_get_5 = desc.get
        local ____desc_configurable_0 = desc.configurable
        if ____desc_configurable_0 == nil then
            ____desc_configurable_0 = valueExists
        end
        local ____desc_enumerable_1 = desc.enumerable
        if ____desc_enumerable_1 == nil then
            ____desc_enumerable_1 = valueExists
        end
        local ____desc_writable_2 = desc.writable
        if ____desc_writable_2 == nil then
            ____desc_writable_2 = valueExists
        end
        local ____temp_3
        if desc.value ~= nil then
            ____temp_3 = desc.value
        else
            ____temp_3 = value
        end
        descriptor = {
            set = ____desc_set_4,
            get = ____desc_get_5,
            configurable = ____desc_configurable_0,
            enumerable = ____desc_enumerable_1,
            writable = ____desc_writable_2,
            value = ____temp_3
        }
    end
    __TS__SetDescriptor(target, luaKey, descriptor)
    return target
end

local function __TS__ObjectEntries(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = {key, obj[key]}
    end
    return result
end

local function __TS__ObjectFromEntries(entries)
    local obj = {}
    local iterable = entries
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                break
            end
            local value = result.value
            obj[value[1]] = value[2]
        end
    else
        for ____, entry in ipairs(entries) do
            obj[entry[1]] = entry[2]
        end
    end
    return obj
end

local function __TS__ObjectGroupBy(items, keySelector)
    local result = {}
    local i = 0
    for ____, item in __TS__Iterator(items) do
        local key = keySelector(nil, item, i)
        if result[key] ~= nil then
            local ____result_key_0 = result[key]
            ____result_key_0[#____result_key_0 + 1] = item
        else
            result[key] = {item}
        end
        i = i + 1
    end
    return result
end

local function __TS__ObjectKeys(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = key
    end
    return result
end

local function __TS__ObjectRest(target, usedProperties)
    local result = {}
    for property in pairs(target) do
        if not usedProperties[property] then
            result[property] = target[property]
        end
    end
    return result
end

local function __TS__ObjectValues(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = obj[key]
    end
    return result
end

local function __TS__PromiseAll(iterable)
    local results = {}
    local toResolve = {}
    local numToResolve = 0
    local i = 0
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                results[i + 1] = item.value
            elseif item.state == 2 then
                return __TS__Promise.reject(item.rejectionReason)
            else
                numToResolve = numToResolve + 1
                toResolve[i] = item
            end
        else
            results[i + 1] = item
        end
        i = i + 1
    end
    if numToResolve == 0 then
        return __TS__Promise.resolve(results)
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for index, promise in pairs(toResolve) do
                promise["then"](
                    promise,
                    function(____, data)
                        results[index + 1] = data
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end,
                    function(____, reason)
                        reject(nil, reason)
                    end
                )
            end
        end
    )
end

local function __TS__PromiseAllSettled(iterable)
    local results = {}
    local toResolve = {}
    local numToResolve = 0
    local i = 0
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                results[i + 1] = {status = "fulfilled", value = item.value}
            elseif item.state == 2 then
                results[i + 1] = {status = "rejected", reason = item.rejectionReason}
            else
                numToResolve = numToResolve + 1
                toResolve[i] = item
            end
        else
            results[i + 1] = {status = "fulfilled", value = item}
        end
        i = i + 1
    end
    if numToResolve == 0 then
        return __TS__Promise.resolve(results)
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve)
            for index, promise in pairs(toResolve) do
                promise["then"](
                    promise,
                    function(____, data)
                        results[index + 1] = {status = "fulfilled", value = data}
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end,
                    function(____, reason)
                        results[index + 1] = {status = "rejected", reason = reason}
                        numToResolve = numToResolve - 1
                        if numToResolve == 0 then
                            resolve(nil, results)
                        end
                    end
                )
            end
        end
    )
end

local function __TS__PromiseAny(iterable)
    local rejections = {}
    local pending = {}
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                return __TS__Promise.resolve(item.value)
            elseif item.state == 2 then
                rejections[#rejections + 1] = item.rejectionReason
            else
                pending[#pending + 1] = item
            end
        else
            return __TS__Promise.resolve(item)
        end
    end
    if #pending == 0 then
        return __TS__Promise.reject("No promises to resolve with .any()")
    end
    local numResolved = 0
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for ____, promise in ipairs(pending) do
                promise["then"](
                    promise,
                    function(____, data)
                        resolve(nil, data)
                    end,
                    function(____, reason)
                        rejections[#rejections + 1] = reason
                        numResolved = numResolved + 1
                        if numResolved == #pending then
                            reject(nil, {name = "AggregateError", message = "All Promises rejected", errors = rejections})
                        end
                    end
                )
            end
        end
    )
end

local function __TS__PromiseRace(iterable)
    local pending = {}
    for ____, item in __TS__Iterator(iterable) do
        if __TS__InstanceOf(item, __TS__Promise) then
            if item.state == 1 then
                return __TS__Promise.resolve(item.value)
            elseif item.state == 2 then
                return __TS__Promise.reject(item.rejectionReason)
            else
                pending[#pending + 1] = item
            end
        else
            return __TS__Promise.resolve(item)
        end
    end
    return __TS__New(
        __TS__Promise,
        function(____, resolve, reject)
            for ____, promise in ipairs(pending) do
                promise["then"](
                    promise,
                    function(____, value) return resolve(nil, value) end,
                    function(____, reason) return reject(nil, reason) end
                )
            end
        end
    )
end

local Set
do
    Set = __TS__Class()
    Set.name = "Set"
    function Set.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "Set"
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self:add(result.value)
            end
        else
            local array = values
            for ____, value in ipairs(array) do
                self:add(value)
            end
        end
    end
    function Set.prototype.add(self, value)
        local isNewValue = not self:has(value)
        if isNewValue then
            self.size = self.size + 1
        end
        if self.firstKey == nil then
            self.firstKey = value
            self.lastKey = value
        elseif isNewValue then
            self.nextKey[self.lastKey] = value
            self.previousKey[value] = self.lastKey
            self.lastKey = value
        end
        return self
    end
    function Set.prototype.clear(self)
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Set.prototype.delete(self, value)
        local contains = self:has(value)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[value]
            local previous = self.previousKey[value]
            if next ~= nil and previous ~= nil then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next ~= nil then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous ~= nil then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[value] = nil
            self.previousKey[value] = nil
        end
        return contains
    end
    function Set.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, key, key, self)
        end
    end
    function Set.prototype.has(self, value)
        return self.nextKey[value] ~= nil or self.lastKey == value
    end
    Set.prototype[Symbol.iterator] = function(self)
        return self:values()
    end
    function Set.prototype.entries(self)
        local function getFirstKey()
            return self.firstKey
        end
        local nextKey = self.nextKey
        local key
        local started = false
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                if not started then
                    started = true
                    key = getFirstKey(nil)
                else
                    key = nextKey[key]
                end
                return {done = not key, value = {key, key}}
            end
        }
    end
    function Set.prototype.keys(self)
        local function getFirstKey()
            return self.firstKey
        end
        local nextKey = self.nextKey
        local key
        local started = false
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                if not started then
                    started = true
                    key = getFirstKey(nil)
                else
                    key = nextKey[key]
                end
                return {done = not key, value = key}
            end
        }
    end
    function Set.prototype.values(self)
        local function getFirstKey()
            return self.firstKey
        end
        local nextKey = self.nextKey
        local key
        local started = false
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                if not started then
                    started = true
                    key = getFirstKey(nil)
                else
                    key = nextKey[key]
                end
                return {done = not key, value = key}
            end
        }
    end
    function Set.prototype.union(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            result:add(item)
        end
        return result
    end
    function Set.prototype.intersection(self, other)
        local result = __TS__New(Set)
        for ____, item in __TS__Iterator(self) do
            if other:has(item) then
                result:add(item)
            end
        end
        return result
    end
    function Set.prototype.difference(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            result:delete(item)
        end
        return result
    end
    function Set.prototype.symmetricDifference(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            if self:has(item) then
                result:delete(item)
            else
                result:add(item)
            end
        end
        return result
    end
    function Set.prototype.isSubsetOf(self, other)
        for ____, item in __TS__Iterator(self) do
            if not other:has(item) then
                return false
            end
        end
        return true
    end
    function Set.prototype.isSupersetOf(self, other)
        for ____, item in __TS__Iterator(other) do
            if not self:has(item) then
                return false
            end
        end
        return true
    end
    function Set.prototype.isDisjointFrom(self, other)
        for ____, item in __TS__Iterator(self) do
            if other:has(item) then
                return false
            end
        end
        return true
    end
    Set[Symbol.species] = Set
end

local function __TS__SparseArrayNew(...)
    local sparseArray = {...}
    sparseArray.sparseLength = __TS__CountVarargs(...)
    return sparseArray
end

local function __TS__SparseArrayPush(sparseArray, ...)
    local args = {...}
    local argsLen = __TS__CountVarargs(...)
    local listLen = sparseArray.sparseLength
    for i = 1, argsLen do
        sparseArray[listLen + i] = args[i]
    end
    sparseArray.sparseLength = listLen + argsLen
end

local function __TS__SparseArraySpread(sparseArray)
    local _unpack = unpack or table.unpack
    return _unpack(sparseArray, 1, sparseArray.sparseLength)
end

local WeakMap
do
    WeakMap = __TS__Class()
    WeakMap.name = "WeakMap"
    function WeakMap.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "WeakMap"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self.items[value[1]] = value[2]
            end
        else
            for ____, kvp in ipairs(entries) do
                self.items[kvp[1]] = kvp[2]
            end
        end
    end
    function WeakMap.prototype.delete(self, key)
        local contains = self:has(key)
        self.items[key] = nil
        return contains
    end
    function WeakMap.prototype.get(self, key)
        return self.items[key]
    end
    function WeakMap.prototype.has(self, key)
        return self.items[key] ~= nil
    end
    function WeakMap.prototype.set(self, key, value)
        self.items[key] = value
        return self
    end
    WeakMap[Symbol.species] = WeakMap
end

local WeakSet
do
    WeakSet = __TS__Class()
    WeakSet.name = "WeakSet"
    function WeakSet.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "WeakSet"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self.items[result.value] = true
            end
        else
            for ____, value in ipairs(values) do
                self.items[value] = true
            end
        end
    end
    function WeakSet.prototype.add(self, value)
        self.items[value] = true
        return self
    end
    function WeakSet.prototype.delete(self, value)
        local contains = self:has(value)
        self.items[value] = nil
        return contains
    end
    function WeakSet.prototype.has(self, value)
        return self.items[value] == true
    end
    WeakSet[Symbol.species] = WeakSet
end

local function __TS__SourceMapTraceBack(fileName, sourceMap)
    _G.__TS__sourcemap = _G.__TS__sourcemap or ({})
    _G.__TS__sourcemap[fileName] = sourceMap
    if _G.__TS__originalTraceback == nil then
        local originalTraceback = debug.traceback
        _G.__TS__originalTraceback = originalTraceback
        debug.traceback = function(thread, message, level)
            local trace
            if thread == nil and message == nil and level == nil then
                trace = originalTraceback()
            elseif __TS__StringIncludes(_VERSION, "Lua 5.0") then
                trace = originalTraceback((("[Level " .. tostring(level)) .. "] ") .. tostring(message))
            else
                trace = originalTraceback(thread, message, level)
            end
            if type(trace) ~= "string" then
                return trace
            end
            local function replacer(____, file, srcFile, line)
                local fileSourceMap = _G.__TS__sourcemap[file]
                if fileSourceMap ~= nil and fileSourceMap[line] ~= nil then
                    local data = fileSourceMap[line]
                    if type(data) == "number" then
                        return (srcFile .. ":") .. tostring(data)
                    end
                    return (data.file .. ":") .. tostring(data.line)
                end
                return (file .. ":") .. line
            end
            local result = string.gsub(
                trace,
                "([^%s<]+)%.lua:(%d+)",
                function(file, line) return replacer(nil, file .. ".lua", file .. ".ts", line) end
            )
            local function stringReplacer(____, file, line)
                local fileSourceMap = _G.__TS__sourcemap[file]
                if fileSourceMap ~= nil and fileSourceMap[line] ~= nil then
                    local chunkName = (__TS__Match(file, "%[string \"([^\"]+)\"%]"))
                    local sourceName = string.gsub(chunkName, ".lua$", ".ts")
                    local data = fileSourceMap[line]
                    if type(data) == "number" then
                        return (sourceName .. ":") .. tostring(data)
                    end
                    return (data.file .. ":") .. tostring(data.line)
                end
                return (file .. ":") .. line
            end
            result = string.gsub(
                result,
                "(%[string \"[^\"]+\"%]):(%d+)",
                function(file, line) return stringReplacer(nil, file, line) end
            )
            return result
        end
    end
end

local function __TS__Spread(iterable)
    local arr = {}
    if type(iterable) == "string" then
        for i = 0, #iterable - 1 do
            arr[i + 1] = __TS__StringAccess(iterable, i)
        end
    else
        local len = 0
        for ____, item in __TS__Iterator(iterable) do
            len = len + 1
            arr[len] = item
        end
    end
    return __TS__Unpack(arr)
end

local function __TS__StringCharAt(self, pos)
    if pos ~= pos then
        pos = 0
    end
    if pos < 0 then
        return ""
    end
    return string.sub(self, pos + 1, pos + 1)
end

local function __TS__StringCharCodeAt(self, index)
    if index ~= index then
        index = 0
    end
    if index < 0 then
        return 0 / 0
    end
    return string.byte(self, index + 1) or 0 / 0
end

local function __TS__StringEndsWith(self, searchString, endPosition)
    if endPosition == nil or endPosition > #self then
        endPosition = #self
    end
    return string.sub(self, endPosition - #searchString + 1, endPosition) == searchString
end

local function __TS__StringPadEnd(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if maxLength == -math.huge or maxLength == math.huge then
        error("Invalid string length", 0)
    end
    if #self >= maxLength or #fillString == 0 then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = fillString .. string.rep(
            fillString,
            math.floor(maxLength / #fillString)
        )
    end
    return self .. string.sub(
        fillString,
        1,
        math.floor(maxLength)
    )
end

local function __TS__StringPadStart(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if maxLength == -math.huge or maxLength == math.huge then
        error("Invalid string length", 0)
    end
    if #self >= maxLength or #fillString == 0 then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = fillString .. string.rep(
            fillString,
            math.floor(maxLength / #fillString)
        )
    end
    return string.sub(
        fillString,
        1,
        math.floor(maxLength)
    ) .. self
end

local __TS__StringReplace
do
    local sub = string.sub
    function __TS__StringReplace(source, searchValue, replaceValue)
        local startPos, endPos = string.find(source, searchValue, nil, true)
        if not startPos then
            return source
        end
        local before = sub(source, 1, startPos - 1)
        local replacement = type(replaceValue) == "string" and replaceValue or replaceValue(nil, searchValue, startPos - 1, source)
        local after = sub(source, endPos + 1)
        return (before .. replacement) .. after
    end
end

local __TS__StringSplit
do
    local sub = string.sub
    local find = string.find
    function __TS__StringSplit(source, separator, limit)
        if limit == nil then
            limit = 4294967295
        end
        if limit == 0 then
            return {}
        end
        local result = {}
        local resultIndex = 1
        if separator == nil or separator == "" then
            for i = 1, #source do
                result[resultIndex] = sub(source, i, i)
                resultIndex = resultIndex + 1
            end
        else
            local currentPos = 1
            while resultIndex <= limit do
                local startPos, endPos = find(source, separator, currentPos, true)
                if not startPos then
                    break
                end
                result[resultIndex] = sub(source, currentPos, startPos - 1)
                resultIndex = resultIndex + 1
                currentPos = endPos + 1
            end
            if resultIndex <= limit then
                result[resultIndex] = sub(source, currentPos)
            end
        end
        return result
    end
end

local __TS__StringReplaceAll
do
    local sub = string.sub
    local find = string.find
    function __TS__StringReplaceAll(source, searchValue, replaceValue)
        if type(replaceValue) == "string" then
            local concat = table.concat(
                __TS__StringSplit(source, searchValue),
                replaceValue
            )
            if #searchValue == 0 then
                return (replaceValue .. concat) .. replaceValue
            end
            return concat
        end
        local parts = {}
        local partsIndex = 1
        if #searchValue == 0 then
            parts[1] = replaceValue(nil, "", 0, source)
            partsIndex = 2
            for i = 1, #source do
                parts[partsIndex] = sub(source, i, i)
                parts[partsIndex + 1] = replaceValue(nil, "", i, source)
                partsIndex = partsIndex + 2
            end
        else
            local currentPos = 1
            while true do
                local startPos, endPos = find(source, searchValue, currentPos, true)
                if not startPos then
                    break
                end
                parts[partsIndex] = sub(source, currentPos, startPos - 1)
                parts[partsIndex + 1] = replaceValue(nil, searchValue, startPos - 1, source)
                partsIndex = partsIndex + 2
                currentPos = endPos + 1
            end
            parts[partsIndex] = sub(source, currentPos)
        end
        return table.concat(parts)
    end
end

local function __TS__StringSlice(self, start, ____end)
    if start == nil or start ~= start then
        start = 0
    end
    if ____end ~= ____end then
        ____end = 0
    end
    if start >= 0 then
        start = start + 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = ____end - 1
    end
    return string.sub(self, start, ____end)
end

local function __TS__StringStartsWith(self, searchString, position)
    if position == nil or position < 0 then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

local function __TS__StringSubstr(self, from, length)
    if from ~= from then
        from = 0
    end
    if length ~= nil then
        if length ~= length or length <= 0 then
            return ""
        end
        length = length + from
    end
    if from >= 0 then
        from = from + 1
    end
    return string.sub(self, from, length)
end

local function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

local function __TS__StringTrimEnd(self)
    local result = string.gsub(self, "[%s ﻿]*$", "")
    return result
end

local function __TS__StringTrimStart(self)
    local result = string.gsub(self, "^[%s ﻿]*", "")
    return result
end

local __TS__SymbolRegistryFor, __TS__SymbolRegistryKeyFor
do
    local symbolRegistry = {}
    function __TS__SymbolRegistryFor(key)
        if not symbolRegistry[key] then
            symbolRegistry[key] = __TS__Symbol(key)
        end
        return symbolRegistry[key]
    end
    function __TS__SymbolRegistryKeyFor(sym)
        for key in pairs(symbolRegistry) do
            if symbolRegistry[key] == sym then
                return key
            end
        end
        return nil
    end
end

local function __TS__TypeOf(value)
    local luaType = type(value)
    if luaType == "table" then
        return "object"
    elseif luaType == "nil" then
        return "undefined"
    else
        return luaType
    end
end

local function __TS__Using(self, cb, ...)
    local args = {...}
    local thrownError
    local ok, result = xpcall(
        function() return cb(__TS__Unpack(args)) end,
        function(err)
            thrownError = err
            return thrownError
        end
    )
    local argArray = {__TS__Unpack(args)}
    do
        local i = #argArray - 1
        while i >= 0 do
            local ____self_0 = argArray[i + 1]
            ____self_0[Symbol.dispose](____self_0)
            i = i - 1
        end
    end
    if not ok then
        error(thrownError, 0)
    end
    return result
end

local function __TS__UsingAsync(self, cb, ...)
    local args = {...}
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        local thrownError
        local ok, result = xpcall(
            function() return cb(
                nil,
                __TS__Unpack(args)
            ) end,
            function(err)
                thrownError = err
                return thrownError
            end
        )
        local argArray = {__TS__Unpack(args)}
        do
            local i = #argArray - 1
            while i >= 0 do
                if argArray[i + 1][Symbol.dispose] ~= nil then
                    local ____self_0 = argArray[i + 1]
                    ____self_0[Symbol.dispose](____self_0)
                end
                if argArray[i + 1][Symbol.asyncDispose] ~= nil then
                    local ____self_1 = argArray[i + 1]
                    __TS__Await(____self_1[Symbol.asyncDispose](____self_1))
                end
                i = i - 1
            end
        end
        if not ok then
            error(thrownError, 0)
        end
        return ____awaiter_resolve(nil, result)
    end)
end

return {
  __TS__ArrayAt = __TS__ArrayAt,
  __TS__ArrayConcat = __TS__ArrayConcat,
  __TS__ArrayEntries = __TS__ArrayEntries,
  __TS__ArrayEvery = __TS__ArrayEvery,
  __TS__ArrayFill = __TS__ArrayFill,
  __TS__ArrayFilter = __TS__ArrayFilter,
  __TS__ArrayForEach = __TS__ArrayForEach,
  __TS__ArrayFind = __TS__ArrayFind,
  __TS__ArrayFindIndex = __TS__ArrayFindIndex,
  __TS__ArrayFrom = __TS__ArrayFrom,
  __TS__ArrayIncludes = __TS__ArrayIncludes,
  __TS__ArrayIndexOf = __TS__ArrayIndexOf,
  __TS__ArrayIsArray = __TS__ArrayIsArray,
  __TS__ArrayJoin = __TS__ArrayJoin,
  __TS__ArrayMap = __TS__ArrayMap,
  __TS__ArrayPush = __TS__ArrayPush,
  __TS__ArrayPushArray = __TS__ArrayPushArray,
  __TS__ArrayReduce = __TS__ArrayReduce,
  __TS__ArrayReduceRight = __TS__ArrayReduceRight,
  __TS__ArrayReverse = __TS__ArrayReverse,
  __TS__ArrayUnshift = __TS__ArrayUnshift,
  __TS__ArraySort = __TS__ArraySort,
  __TS__ArraySlice = __TS__ArraySlice,
  __TS__ArraySome = __TS__ArraySome,
  __TS__ArraySplice = __TS__ArraySplice,
  __TS__ArrayToObject = __TS__ArrayToObject,
  __TS__ArrayFlat = __TS__ArrayFlat,
  __TS__ArrayFlatMap = __TS__ArrayFlatMap,
  __TS__ArraySetLength = __TS__ArraySetLength,
  __TS__ArrayToReversed = __TS__ArrayToReversed,
  __TS__ArrayToSorted = __TS__ArrayToSorted,
  __TS__ArrayToSpliced = __TS__ArrayToSpliced,
  __TS__ArrayWith = __TS__ArrayWith,
  __TS__AsyncAwaiter = __TS__AsyncAwaiter,
  __TS__Await = __TS__Await,
  __TS__Class = __TS__Class,
  __TS__ClassExtends = __TS__ClassExtends,
  __TS__CloneDescriptor = __TS__CloneDescriptor,
  __TS__CountVarargs = __TS__CountVarargs,
  __TS__Decorate = __TS__Decorate,
  __TS__DecorateLegacy = __TS__DecorateLegacy,
  __TS__DecorateParam = __TS__DecorateParam,
  __TS__Delete = __TS__Delete,
  __TS__DelegatedYield = __TS__DelegatedYield,
  __TS__DescriptorGet = __TS__DescriptorGet,
  __TS__DescriptorSet = __TS__DescriptorSet,
  Error = Error,
  RangeError = RangeError,
  ReferenceError = ReferenceError,
  SyntaxError = SyntaxError,
  TypeError = TypeError,
  URIError = URIError,
  __TS__FunctionBind = __TS__FunctionBind,
  __TS__Generator = __TS__Generator,
  __TS__InstanceOf = __TS__InstanceOf,
  __TS__InstanceOfObject = __TS__InstanceOfObject,
  __TS__Iterator = __TS__Iterator,
  __TS__LuaIteratorSpread = __TS__LuaIteratorSpread,
  Map = Map,
  __TS__MapGroupBy = __TS__MapGroupBy,
  __TS__Match = __TS__Match,
  __TS__MathAtan2 = __TS__MathAtan2,
  __TS__MathModf = __TS__MathModf,
  __TS__MathSign = __TS__MathSign,
  __TS__MathTrunc = __TS__MathTrunc,
  __TS__New = __TS__New,
  __TS__Number = __TS__Number,
  __TS__NumberIsFinite = __TS__NumberIsFinite,
  __TS__NumberIsInteger = __TS__NumberIsInteger,
  __TS__NumberIsNaN = __TS__NumberIsNaN,
  __TS__ParseInt = __TS__ParseInt,
  __TS__ParseFloat = __TS__ParseFloat,
  __TS__NumberToString = __TS__NumberToString,
  __TS__NumberToFixed = __TS__NumberToFixed,
  __TS__ObjectAssign = __TS__ObjectAssign,
  __TS__ObjectDefineProperty = __TS__ObjectDefineProperty,
  __TS__ObjectEntries = __TS__ObjectEntries,
  __TS__ObjectFromEntries = __TS__ObjectFromEntries,
  __TS__ObjectGetOwnPropertyDescriptor = __TS__ObjectGetOwnPropertyDescriptor,
  __TS__ObjectGetOwnPropertyDescriptors = __TS__ObjectGetOwnPropertyDescriptors,
  __TS__ObjectGroupBy = __TS__ObjectGroupBy,
  __TS__ObjectKeys = __TS__ObjectKeys,
  __TS__ObjectRest = __TS__ObjectRest,
  __TS__ObjectValues = __TS__ObjectValues,
  __TS__ParseFloat = __TS__ParseFloat,
  __TS__ParseInt = __TS__ParseInt,
  __TS__Promise = __TS__Promise,
  __TS__PromiseAll = __TS__PromiseAll,
  __TS__PromiseAllSettled = __TS__PromiseAllSettled,
  __TS__PromiseAny = __TS__PromiseAny,
  __TS__PromiseRace = __TS__PromiseRace,
  Set = Set,
  __TS__SetDescriptor = __TS__SetDescriptor,
  __TS__SparseArrayNew = __TS__SparseArrayNew,
  __TS__SparseArrayPush = __TS__SparseArrayPush,
  __TS__SparseArraySpread = __TS__SparseArraySpread,
  WeakMap = WeakMap,
  WeakSet = WeakSet,
  __TS__SourceMapTraceBack = __TS__SourceMapTraceBack,
  __TS__Spread = __TS__Spread,
  __TS__StringAccess = __TS__StringAccess,
  __TS__StringCharAt = __TS__StringCharAt,
  __TS__StringCharCodeAt = __TS__StringCharCodeAt,
  __TS__StringEndsWith = __TS__StringEndsWith,
  __TS__StringIncludes = __TS__StringIncludes,
  __TS__StringPadEnd = __TS__StringPadEnd,
  __TS__StringPadStart = __TS__StringPadStart,
  __TS__StringReplace = __TS__StringReplace,
  __TS__StringReplaceAll = __TS__StringReplaceAll,
  __TS__StringSlice = __TS__StringSlice,
  __TS__StringSplit = __TS__StringSplit,
  __TS__StringStartsWith = __TS__StringStartsWith,
  __TS__StringSubstr = __TS__StringSubstr,
  __TS__StringSubstring = __TS__StringSubstring,
  __TS__StringTrim = __TS__StringTrim,
  __TS__StringTrimEnd = __TS__StringTrimEnd,
  __TS__StringTrimStart = __TS__StringTrimStart,
  __TS__Symbol = __TS__Symbol,
  Symbol = Symbol,
  __TS__SymbolRegistryFor = __TS__SymbolRegistryFor,
  __TS__SymbolRegistryKeyFor = __TS__SymbolRegistryKeyFor,
  __TS__TypeOf = __TS__TypeOf,
  __TS__Unpack = __TS__Unpack,
  __TS__Using = __TS__Using,
  __TS__UsingAsync = __TS__UsingAsync
}
 end,
["toolkit.events.src.event-target.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["toolkit.events.src.event-target.listeners"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local ____exports = {}
--- Хранилище обработчиков событий. В зону ответственности хранилища, входит скрытие деталей
-- реализации от пользователя. Пользователь должен иметь возможность добавлять обработчики для
-- событий, удалять их и перебирать. Но, пользователя не должно волновать как события хранятся:
-- с помощью Map, массивов, Set или обычных объектов.
____exports.Listeners = __TS__Class()
local Listeners = ____exports.Listeners
Listeners.name = "Listeners"
function Listeners.prototype.____constructor(self)
    self.listeners = __TS__New(Map)
end
function Listeners.prototype.add(self, ____type, listener, options)
    local eventListeners = self:getOrInsert(____type)
    if eventListeners:has(listener) then
        return
    end
    eventListeners:set(listener, {actual = true, options = options})
end
function Listeners.prototype.delete(self, ____type, listener)
    local eventListeners = self:get(____type)
    if not eventListeners then
        return
    end
    local details = eventListeners:get(listener)
    if not details then
        return
    end
    details.actual = false
    eventListeners:delete(listener)
end
function Listeners.prototype.forEach(self, ____type, visitor)
    local eventListeners = self:get(____type)
    if not eventListeners then
        return
    end
    __TS__New(Map, eventListeners):forEach(function(____, details, listener)
        if details.actual then
            visitor(listener, details.options)
        end
    end)
end
function Listeners.prototype.get(self, ____type)
    return self.listeners:get(____type)
end
function Listeners.prototype.getOrInsert(self, ____type)
    if not self.listeners:has(____type) then
        self.listeners:set(
            ____type,
            __TS__New(Map)
        )
    end
    return self.listeners:get(____type)
end
return ____exports
 end,
["toolkit.events.src.event-target.event-target"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__Spread = ____lualib.__TS__Spread
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____listeners = require("toolkit.events.src.event-target.listeners")
local Listeners = ____listeners.Listeners
local DEFAULT_LISTENER_OPTIONS = {once = false}
____exports.EventTarget = __TS__Class()
local EventTarget = ____exports.EventTarget
EventTarget.name = "EventTarget"
function EventTarget.prototype.____constructor(self)
    self.listeners = __TS__New(Listeners)
end
function EventTarget.prototype.dispatchEvent(self, ____type, ...)
    local payload = {...}
    self.listeners:forEach(
        ____type,
        function(listener, options)
            do
                local function ____catch(____error)
                    reportError(____error)
                end
                local ____try, ____hasReturned = pcall(function()
                    if options.once then
                        self:removeEventListener(____type, listener)
                    end
                    listener(__TS__Spread(payload))
                end)
                if not ____try then
                    ____catch(____hasReturned)
                end
            end
        end
    )
end
function EventTarget.prototype.addEventListener(self, ____type, listener, options)
    if options == nil then
        options = DEFAULT_LISTENER_OPTIONS
    end
    if options.signal then
        if options.signal.aborted then
            return
        end
        options.signal:addEventListener(
            "abort",
            function() return self:removeEventListener(____type, listener) end,
            {once = true}
        )
    end
    self.listeners:add(
        ____type,
        listener,
        __TS__ObjectAssign({}, DEFAULT_LISTENER_OPTIONS, options)
    )
end
function EventTarget.prototype.removeEventListener(self, ____type, listener)
    self.listeners:delete(____type, listener)
end
return ____exports
 end,
["toolkit.events.src.event-target.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____event_2Dtarget = require("toolkit.events.src.event-target.event-target")
    ____exports.EventTarget = ____event_2Dtarget.EventTarget
end
return ____exports
 end,
["toolkit.events.src.abort-signal.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["toolkit.events.src.abort-signal.states.aborted"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.AbortedState = __TS__Class()
local AbortedState = ____exports.AbortedState
AbortedState.name = "AbortedState"
function AbortedState.prototype.____constructor(self, reason)
    self.aborted = true
    self.reason = reason
end
function AbortedState.prototype.throwIfAborted(self)
    error(self.reason, 0)
end
return ____exports
 end,
["toolkit.events.src.abort-signal.states.pending"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.PendingState = __TS__Class()
local PendingState = ____exports.PendingState
PendingState.name = "PendingState"
function PendingState.prototype.____constructor(self)
    self.aborted = false
    self.reason = nil
end
function PendingState.prototype.throwIfAborted(self)
    return
end
return ____exports
 end,
["toolkit.events.src.abort-signal.abort-signal"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ArrayFind = ____lualib.__TS__ArrayFind
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____event_2Dtarget = require("toolkit.events.src.event-target.index")
local EventTarget = ____event_2Dtarget.EventTarget
local ____aborted = require("toolkit.events.src.abort-signal.states.aborted")
local AbortedState = ____aborted.AbortedState
local ____pending = require("toolkit.events.src.abort-signal.states.pending")
local PendingState = ____pending.PendingState
____exports.AbortSignal = __TS__Class()
local AbortSignal = ____exports.AbortSignal
AbortSignal.name = "AbortSignal"
__TS__ClassExtends(AbortSignal, EventTarget)
function AbortSignal.prototype.____constructor(self, executor)
    EventTarget.prototype.____constructor(self)
    self.state = __TS__New(PendingState)
    self.onabort = nil
    executor(function(...) return self:toAbort(...) end)
    self:addEventListener(
        "abort",
        function(reason)
            if self.onabort then
                self.onabort(reason)
            end
        end
    )
end
function AbortSignal.prototype.throwIfAborted(self)
    self.state:throwIfAborted()
end
function AbortSignal.prototype.toAbort(self, reason)
    if self.aborted then
        return
    end
    local computedReason = type(reason) == "nil" and self:getDefaultReason() or reason
    self.state = __TS__New(AbortedState, computedReason)
    self:dispatchEvent("abort", computedReason)
end
function AbortSignal.prototype.getDefaultReason(self)
    local defaultReason = __TS__New(Error, "signal is aborted without reason")
    defaultReason.name = "AbortError"
    return defaultReason
end
function AbortSignal.abort(self, reason)
    return __TS__New(
        ____exports.AbortSignal,
        function(abort) return abort(reason) end
    )
end
function AbortSignal.any(self, signals)
    local abortedSignal = __TS__ArrayFind(
        signals,
        function(____, signal) return signal.aborted end
    )
    if abortedSignal then
        return ____exports.AbortSignal:abort(abortedSignal.reason)
    end
    return __TS__New(
        ____exports.AbortSignal,
        function(abort)
            __TS__ArrayForEach(
                signals,
                function(____, signal)
                    local ____signal_0 = signal
                    local ____signal_addEventListener_1 = signal.addEventListener
                    local function listener(reason)
                        __TS__ArrayForEach(
                            signals,
                            function(____, signal) return signal:removeEventListener("abort", listener) end
                        )
                        abort(reason)
                    end
                    ____signal_addEventListener_1(____signal_0, "abort", listener, {once = true})
                end
            )
        end
    )
end
function AbortSignal.timeout(self, ms)
    local reason = __TS__New(Error, "signal timed out")
    reason.name = "TimeoutError"
    return __TS__New(
        ____exports.AbortSignal,
        function(abort) return setTimeout(abort, ms, reason) end
    )
end
__TS__SetDescriptor(
    AbortSignal.prototype,
    "aborted",
    {get = function(self)
        return self.state.aborted
    end},
    true
)
__TS__SetDescriptor(
    AbortSignal.prototype,
    "reason",
    {get = function(self)
        return self.state.reason
    end},
    true
)
return ____exports
 end,
["toolkit.events.src.abort-signal.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____abort_2Dsignal = require("toolkit.events.src.abort-signal.abort-signal")
    ____exports.AbortSignal = ____abort_2Dsignal.AbortSignal
end
return ____exports
 end,
["toolkit.events.src.abort-controller.abort-controller"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____abort_2Dsignal = require("toolkit.events.src.abort-signal.index")
local AbortSignal = ____abort_2Dsignal.AbortSignal
____exports.AbortController = __TS__Class()
local AbortController = ____exports.AbortController
AbortController.name = "AbortController"
function AbortController.prototype.____constructor(self)
    self.signal = __TS__New(
        AbortSignal,
        function(abort)
            self.signalAbort = abort
        end
    )
end
function AbortController.prototype.abort(self, reason)
    self.signalAbort(reason)
end
return ____exports
 end,
["toolkit.events.src.abort-controller.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____abort_2Dcontroller = require("toolkit.events.src.abort-controller.abort-controller")
    ____exports.AbortController = ____abort_2Dcontroller.AbortController
end
return ____exports
 end,
["toolkit.events.src.subscriber.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["toolkit.events.src.subscriber.normalize-observer"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
--- Приводит переданный observer к одному формату, когда observer является объектом со всеми методами
function ____exports.normalizeObserver(observer)
    local function noop()
    end
    local defaultObserver = {
        next = noop,
        error = function(____, ____error) return reportError(____error) end,
        complete = noop
    }
    if not observer then
        return defaultObserver
    end
    if type(observer) == "function" then
        return __TS__ObjectAssign(
            {},
            defaultObserver,
            {next = function(____, value) return observer(value) end}
        )
    end
    local ____observer_0 = observer
    local next = ____observer_0.next
    local complete = ____observer_0.complete
    local ____error = ____observer_0.error
    return {
        next = type(next) == "function" and (function(____, value)
            local ____this_2
            ____this_2 = observer
            local ____opt_1 = ____this_2.next
            return ____opt_1 and ____opt_1(____this_2, value)
        end) or defaultObserver.next,
        complete = type(complete) == "function" and (function()
            local ____this_4
            ____this_4 = observer
            local ____opt_3 = ____this_4.complete
            return ____opt_3 and ____opt_3(____this_4)
        end) or defaultObserver.complete,
        error = type(____error) == "function" and (function(____, reason)
            local ____this_6
            ____this_6 = observer
            local ____opt_5 = ____this_6.error
            return ____opt_5 and ____opt_5(____this_6, reason)
        end) or defaultObserver.error
    }
end
return ____exports
 end,
["toolkit.events.src.subscriber.subscriber"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__ArraySplice = ____lualib.__TS__ArraySplice
local __TS__ArrayReverse = ____lualib.__TS__ArrayReverse
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____abort_2Dcontroller = require("toolkit.events.src.abort-controller.index")
local AbortController = ____abort_2Dcontroller.AbortController
local ____normalize_2Dobserver = require("toolkit.events.src.subscriber.normalize-observer")
local normalizeObserver = ____normalize_2Dobserver.normalizeObserver
local function noop()
end
____exports.Subscriber = __TS__Class()
local Subscriber = ____exports.Subscriber
Subscriber.name = "Subscriber"
function Subscriber.prototype.____constructor(self, observer, options)
    if options == nil then
        options = {}
    end
    self.observer = normalizeObserver(observer)
    self.abortController = __TS__New(AbortController)
    self.teardowns = {}
    self.signal = self.abortController.signal
    if options.signal then
        self:listenOuterSignal(options.signal)
    end
end
function Subscriber.prototype.addTeardown(self, teardown)
    if self.active then
        local ____self_teardowns_0 = self.teardowns
        ____self_teardowns_0[#____self_teardowns_0 + 1] = teardown
    else
        self:callOneTeardown(teardown)
    end
end
function Subscriber.prototype.complete(self)
    self:deactivate(function() return self.observer:complete() end)
end
function Subscriber.prototype.error(self, ____error)
    self:deactivate(
        function() return self.observer:error(____error) end,
        ____error
    )
end
function Subscriber.prototype.next(self, value)
    if not self.active then
        return
    end
    do
        local function ____catch(____error)
            reportError(____error)
        end
        local ____try, ____hasReturned = pcall(function()
            self.observer:next(value)
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
end
function Subscriber.prototype.listenOuterSignal(self, signal)
    if signal.aborted then
        self.abortController:abort(signal.reason)
        return
    end
    signal:addEventListener(
        "abort",
        function() return self:deactivate(noop, signal.reason) end,
        {once = true, signal = self.signal}
    )
end
function Subscriber.prototype.deactivate(self, callObserver, reason)
    if not self.active then
        return
    end
    self.abortController:abort(reason)
    self:callRegisteredTeardowns()
    __TS__ArraySplice(self.teardowns, 0, #self.teardowns)
    if callObserver then
        do
            local function ____catch(____error)
                reportError(____error)
            end
            local ____try, ____hasReturned = pcall(function()
                callObserver()
            end)
            if not ____try then
                ____catch(____hasReturned)
            end
        end
    end
end
function Subscriber.prototype.callRegisteredTeardowns(self)
    __TS__ArrayForEach(
        __TS__ArrayReverse({unpack(self.teardowns)}),
        function(____, teardown) return self:callOneTeardown(teardown) end
    )
end
function Subscriber.prototype.callOneTeardown(self, teardown)
    do
        local function ____catch(____error)
            reportError(____error)
        end
        local ____try, ____hasReturned = pcall(function()
            teardown()
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
end
__TS__SetDescriptor(
    Subscriber.prototype,
    "active",
    {get = function(self)
        return not self.signal.aborted
    end},
    true
)
return ____exports
 end,
["toolkit.events.src.subscriber.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____normalize_2Dobserver = require("toolkit.events.src.subscriber.normalize-observer")
    ____exports.normalizeObserver = ____normalize_2Dobserver.normalizeObserver
end
do
    local ____subscriber = require("toolkit.events.src.subscriber.subscriber")
    ____exports.Subscriber = ____subscriber.Subscriber
end
return ____exports
 end,
["toolkit.events.src.multicast-observer.multicast-observer"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____abort_2Dcontroller = require("toolkit.events.src.abort-controller.index")
local AbortController = ____abort_2Dcontroller.AbortController
local ____abort_2Dsignal = require("toolkit.events.src.abort-signal.index")
local AbortSignal = ____abort_2Dsignal.AbortSignal
local ____event_2Dtarget = require("toolkit.events.src.event-target.index")
local EventTarget = ____event_2Dtarget.EventTarget
local ____subscriber = require("toolkit.events.src.subscriber.index")
local normalizeObserver = ____subscriber.normalizeObserver
____exports.MulticastObserver = __TS__Class()
local MulticastObserver = ____exports.MulticastObserver
MulticastObserver.name = "MulticastObserver"
function MulticastObserver.prototype.____constructor(self)
    self.abortController = __TS__New(AbortController)
    self.eventTarget = __TS__New(EventTarget)
    self.observersCount = 0
end
function MulticastObserver.prototype.add(self, observer, options)
    if options == nil then
        options = {}
    end
    self.observersCount = self.observersCount + 1
    local normalizedObserver = normalizeObserver(observer)
    local signals = {self.signal}
    if options.signal then
        local ____options_0 = options
        local signal = ____options_0.signal
        signals[#signals + 1] = signal
        signal:addEventListener(
            "abort",
            function() return self:onSignalAborted(signal) end,
            {once = true, signal = self.signal}
        )
        if signal.aborted then
            self:onSignalAborted(signal)
        end
    end
    local listenerOptions = {signal = AbortSignal:any(signals)}
    self.eventTarget:addEventListener(
        "next",
        function(value) return normalizedObserver:next(value) end,
        listenerOptions
    )
    self.eventTarget:addEventListener(
        "complete",
        function() return normalizedObserver:complete() end,
        listenerOptions
    )
    self.eventTarget:addEventListener(
        "error",
        function(____error) return normalizedObserver:error(____error) end,
        listenerOptions
    )
end
function MulticastObserver.prototype.error(self, ____error)
    self.eventTarget:dispatchEvent("error", ____error)
    self.abortController:abort("subscriber failed")
end
function MulticastObserver.prototype.complete(self)
    self.eventTarget:dispatchEvent("complete")
    self.abortController:abort("subscriber success")
end
function MulticastObserver.prototype.next(self, value)
    self.eventTarget:dispatchEvent("next", value)
end
function MulticastObserver.prototype.onSignalAborted(self, signal)
    self.observersCount = self.observersCount - 1
    if self.observersCount == 0 then
        self.abortController:abort(signal.reason)
    end
end
__TS__SetDescriptor(
    MulticastObserver.prototype,
    "signal",
    {get = function(self)
        return self.abortController.signal
    end},
    true
)
return ____exports
 end,
["toolkit.events.src.multicast-observer.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____multicast_2Dobserver = require("toolkit.events.src.multicast-observer.multicast-observer")
    ____exports.MulticastObserver = ____multicast_2Dobserver.MulticastObserver
end
return ____exports
 end,
["toolkit.events.src.observable.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["toolkit.events.src.observable.from-executors"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Promise = ____lualib.__TS__Promise
local ____exports = {}
--- Executor для Observable.from из массива: выдаёт элементы синхронно при подписке и завершается.
-- Массив читается при каждой подписке, а не при вызове from, как того требует спецификация
function ____exports.createArrayExecutor(values)
    return function(subscriber)
        for ____, value in ipairs(values) do
            if not subscriber.active then
                return
            end
            subscriber:next(value)
        end
        subscriber:complete()
    end
end
--- Executor для Observable.from из промиса: выдаёт значение, с которым промис выполнился, и
-- завершается, а если промис отклонён, завершается с ошибкой
function ____exports.createPromiseExecutor(promise)
    return function(subscriber)
        promise["then"](
            promise,
            function(____, value)
                subscriber:next(value)
                subscriber:complete()
            end,
            function(____, reason) return subscriber:error(reason) end
        )
    end
end
return ____exports
 end,
["toolkit.events.src.observable.inspect-operator"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
--- Оператор inspect: наблюдатель исходного Observable в одной подписке на результат inspect. Вызывает колбэки
-- инспектора и передаёт события подписчику без изменений. Исключение в колбэке инспектора
-- завершает поток с этим исключением.
____exports.InspectOperator = __TS__Class()
local InspectOperator = ____exports.InspectOperator
InspectOperator.name = "InspectOperator"
function InspectOperator.prototype.____constructor(self, options)
    self.subscriber = options.subscriber
    local ____options_0 = options
    local inspector = ____options_0.inspector
    self.inspector = type(inspector) == "function" and ({next = function(____, value) return inspector(value) end}) or inspector
    self.abortListener = function() return self:callAbort() end
end
function InspectOperator.prototype.observe(self, source)
    do
        local function ____catch(____error)
            self.subscriber:error(____error)
            return true
        end
        local ____try, ____hasReturned, ____returnValue = pcall(function()
            local ____this_2
            ____this_2 = self.inspector
            local ____opt_1 = ____this_2.subscribe
            if ____opt_1 ~= nil then
                ____opt_1(____this_2)
            end
        end)
        if not ____try then
            ____hasReturned, ____returnValue = ____catch(____hasReturned)
        end
        if ____hasReturned then
            return ____returnValue
        end
    end
    self.subscriber.signal:addEventListener("abort", self.abortListener)
    source:subscribe(self, {signal = self.subscriber.signal})
end
function InspectOperator.prototype.next(self, value)
    do
        local function ____catch(____error)
            self:finish(function() return self.subscriber:error(____error) end)
            return true
        end
        local ____try, ____hasReturned, ____returnValue = pcall(function()
            local ____this_4
            ____this_4 = self.inspector
            local ____opt_3 = ____this_4.next
            if ____opt_3 ~= nil then
                ____opt_3(____this_4, value)
            end
        end)
        if not ____try then
            ____hasReturned, ____returnValue = ____catch(____hasReturned)
        end
        if ____hasReturned then
            return ____returnValue
        end
    end
    self.subscriber:next(value)
end
function InspectOperator.prototype.error(self, ____error)
    self:finish(function()
        local ____this_6
        ____this_6 = self.inspector
        local ____opt_5 = ____this_6.error
        if ____opt_5 ~= nil then
            ____opt_5(____this_6, ____error)
        end
        self.subscriber:error(____error)
    end)
end
function InspectOperator.prototype.complete(self)
    self:finish(function()
        local ____this_8
        ____this_8 = self.inspector
        local ____opt_7 = ____this_8.complete
        if ____opt_7 ~= nil then
            ____opt_7(____this_8)
        end
        self.subscriber:complete()
    end)
end
function InspectOperator.prototype.finish(self, finishing)
    self.subscriber.signal:removeEventListener("abort", self.abortListener)
    do
        local function ____catch(____error)
            self.subscriber:error(____error)
        end
        local ____try, ____hasReturned = pcall(function()
            finishing()
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
end
function InspectOperator.prototype.callAbort(self)
    do
        local function ____catch(____error)
            reportError(____error)
        end
        local ____try, ____hasReturned = pcall(function()
            local ____this_10
            ____this_10 = self.inspector
            local ____opt_9 = ____this_10.abort
            if ____opt_9 ~= nil then
                ____opt_9(____this_10, self.subscriber.signal.reason)
            end
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
end
return ____exports
 end,
["toolkit.events.src.observable.switch-map-operator"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____abort_2Dcontroller = require("toolkit.events.src.abort-controller.index")
local AbortController = ____abort_2Dcontroller.AbortController
local ____abort_2Dsignal = require("toolkit.events.src.abort-signal.index")
local AbortSignal = ____abort_2Dsignal.AbortSignal
--- Оператор switchMap: наблюдатель исходного Observable в одной подписке на результат switchMap.
-- На каждое значение отписывается от предыдущего внутреннего Observable и подписывается на новый,
-- полученный из mapper. Результат завершается, когда завершились и исходный Observable, и
-- последний внутренний.
____exports.SwitchMapOperator = __TS__Class()
local SwitchMapOperator = ____exports.SwitchMapOperator
SwitchMapOperator.name = "SwitchMapOperator"
function SwitchMapOperator.prototype.____constructor(self, options)
    self.subscriber = options.subscriber
    self.mapper = options.mapper
    self.index = 0
    self.sourceCompleted = false
    self.innerController = nil
end
function SwitchMapOperator.prototype.observe(self, source)
    source:subscribe(self, {signal = self.subscriber.signal})
end
function SwitchMapOperator.prototype.next(self, value)
    local ____opt_0 = self.innerController
    if ____opt_0 ~= nil then
        ____opt_0:abort()
    end
    local controller = __TS__New(AbortController)
    self.innerController = controller
    local inner
    do
        local function ____catch(____error)
            self.subscriber:error(____error)
            return true
        end
        local ____try, ____hasReturned, ____returnValue = pcall(function()
            inner = self.mapper(value, self.index)
        end)
        if not ____try then
            ____hasReturned, ____returnValue = ____catch(____hasReturned)
        end
        if ____hasReturned then
            return ____returnValue
        end
    end
    self.index = self.index + 1
    self:subscribeToInner(inner, controller.signal)
end
function SwitchMapOperator.prototype.error(self, ____error)
    self.subscriber:error(____error)
end
function SwitchMapOperator.prototype.complete(self)
    self.sourceCompleted = true
    if not self.innerController then
        self.subscriber:complete()
    end
end
function SwitchMapOperator.prototype.subscribeToInner(self, inner, innerSignal)
    inner:subscribe(
        {
            next = function(____, value) return self.subscriber:next(value) end,
            error = function(____, ____error) return self.subscriber:error(____error) end,
            complete = function() return self:completeInner() end
        },
        {signal = AbortSignal:any({self.subscriber.signal, innerSignal})}
    )
end
function SwitchMapOperator.prototype.completeInner(self)
    if self.sourceCompleted then
        self.subscriber:complete()
    else
        self.innerController = nil
    end
end
return ____exports
 end,
["toolkit.events.src.observable.observable"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__InstanceOf = ____lualib.__TS__InstanceOf
local __TS__ArrayIsArray = ____lualib.__TS__ArrayIsArray
local __TS__New = ____lualib.__TS__New
local __TS__Promise = ____lualib.__TS__Promise
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local ____exports = {}
local ____multicast_2Dobserver = require("toolkit.events.src.multicast-observer.index")
local MulticastObserver = ____multicast_2Dobserver.MulticastObserver
local ____subscriber = require("toolkit.events.src.subscriber.index")
local Subscriber = ____subscriber.Subscriber
local ____from_2Dexecutors = require("toolkit.events.src.observable.from-executors")
local createArrayExecutor = ____from_2Dexecutors.createArrayExecutor
local createPromiseExecutor = ____from_2Dexecutors.createPromiseExecutor
local ____inspect_2Doperator = require("toolkit.events.src.observable.inspect-operator")
local InspectOperator = ____inspect_2Doperator.InspectOperator
local ____switch_2Dmap_2Doperator = require("toolkit.events.src.observable.switch-map-operator")
local SwitchMapOperator = ____switch_2Dmap_2Doperator.SwitchMapOperator
____exports.Observable = __TS__Class()
local Observable = ____exports.Observable
Observable.name = "Observable"
function Observable.prototype.____constructor(self, executor)
    self.executor = executor
    self.multicast = nil
    self.subscriber = nil
end
function Observable.from(self, value)
    if __TS__InstanceOf(value, ____exports.Observable) then
        return value
    end
    if __TS__ArrayIsArray(value) then
        return __TS__New(
            ____exports.Observable,
            createArrayExecutor(value)
        )
    end
    if __TS__InstanceOf(value, __TS__Promise) then
        return __TS__New(
            ____exports.Observable,
            createPromiseExecutor(value)
        )
    end
    error(
        __TS__New(TypeError, "Observable.from поддерживает только Observable, массивы и промисы"),
        0
    )
end
function Observable.prototype.subscribe(self, observer, options)
    if options == nil then
        options = {}
    end
    local multicast = self:getOrCreateMulticast()
    multicast:add(observer, options)
    local ____opt_0 = self.subscriber
    local ____temp_2 = ____opt_0 and ____opt_0.active
    if ____temp_2 == nil then
        ____temp_2 = false
    end
    local subscriberActive = ____temp_2
    local subscriber = self:getOrCreateSubscriber(multicast, {signal = multicast.signal})
    if not subscriberActive then
        do
            local function ____catch(____error)
                subscriber:error(____error)
            end
            local ____try, ____hasReturned = pcall(function()
                self.executor(subscriber)
            end)
            if not ____try then
                ____catch(____hasReturned)
            end
        end
    end
end
function Observable.prototype.switchMap(self, mapper)
    return __TS__New(
        ____exports.Observable,
        function(subscriber)
            local operator = __TS__New(
                SwitchMapOperator,
                {
                    subscriber = subscriber,
                    mapper = function(value, index) return ____exports.Observable:from(mapper(value, index)) end
                }
            )
            operator:observe(self)
        end
    )
end
function Observable.prototype.inspect(self, inspector)
    if inspector == nil then
        inspector = {}
    end
    return __TS__New(
        ____exports.Observable,
        function(subscriber)
            local operator = __TS__New(InspectOperator, {subscriber = subscriber, inspector = inspector})
            operator:observe(self)
        end
    )
end
function Observable.prototype.getOrCreateMulticast(self)
    if self.multicast and self.subscriber and self.subscriber.active then
        return self.multicast
    end
    self.multicast = __TS__New(MulticastObserver)
    return self.multicast
end
function Observable.prototype.getOrCreateSubscriber(self, observer, options)
    if self.subscriber and self.subscriber.active then
        return self.subscriber
    end
    self.subscriber = __TS__New(Subscriber, observer, options)
    return self.subscriber
end
return ____exports
 end,
["toolkit.events.src.observable.when-patch"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____event_2Dtarget = require("toolkit.events.src.event-target.index")
local EventTarget = ____event_2Dtarget.EventTarget
local ____observable = require("toolkit.events.src.observable.observable")
local Observable = ____observable.Observable
EventTarget.prototype.when = function(self, ____type)
    return __TS__New(
        Observable,
        function(subscriber)
            local function listener(...)
                local args = {...}
                subscriber:next(args[0])
            end
            self:addEventListener(____type, listener)
            subscriber:addTeardown(function() return self:removeEventListener(____type, listener) end)
        end
    )
end
return ____exports
 end,
["toolkit.events.src.observable.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____observable = require("toolkit.events.src.observable.observable")
    ____exports.Observable = ____observable.Observable
end
return ____exports
 end,
["toolkit.events.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
require("toolkit.events.src.observable.when-patch")
do
    local ____export = require("toolkit.events.src.abort-controller.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("toolkit.events.src.abort-signal.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("toolkit.events.src.event-target.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("toolkit.events.src.observable.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____subscriber = require("toolkit.events.src.subscriber.index")
    ____exports.Subscriber = ____subscriber.Subscriber
end
return ____exports
 end,
["core.game.src.actor.animation"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.ANIMATIONS = {
    ["trash-search-start"] = {loop = false},
    ["trash-search"] = {loop = true},
    ["trash-search-look-1"] = {loop = false},
    ["trash-search-look-2"] = {loop = false},
    ["trash-search-pocket"] = {loop = false},
    ["trash-search-end"] = {loop = false},
    ["beg-sitting"] = {loop = true},
    ["item-give"] = {loop = false},
    ["item-receive"] = {loop = false},
    pay = {loop = false},
    ["drink-standing-1"] = {loop = true},
    ["drink-standing-2"] = {loop = true}
}
return ____exports
 end,
["toolkit.geometry.src.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["toolkit.geometry.src.geometry"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__NumberToFixed = ____lualib.__TS__NumberToFixed
local ____exports = {}
____exports.Geometry = __TS__Class()
local Geometry = ____exports.Geometry
Geometry.name = "Geometry"
function Geometry.prototype.____constructor(self)
end
function Geometry.prototype.getDistance2d(self, pointA, pointB)
    local x = (pointB.x - pointA.x) ^ 2
    local y = (pointB.y - pointA.y) ^ 2
    return math.sqrt(x + y)
end
function Geometry.prototype.getDistance3d(self, pointA, pointB)
    local x = (pointB.x - pointA.x) ^ 2
    local y = (pointB.y - pointA.y) ^ 2
    local z = (pointB.z - pointA.z) ^ 2
    return math.sqrt(x + y + z)
end
function Geometry.prototype.isWithinRadius2d(self, point, center, radius)
    return self:getDistance2d(point, center) <= radius
end
function Geometry.prototype.isWithinRadius3d(self, point, center, radius)
    return self:getDistance3d(point, center) <= radius
end
function Geometry.prototype.moveTowards(self, current, target, maxDistance)
    local dx = target.x - current.x
    local dy = target.y - current.y
    local dz = target.z - current.z
    local distance = math.sqrt(dx ^ 2 + dy ^ 2 + dz ^ 2)
    if distance <= maxDistance or distance == 0 then
        return __TS__ObjectAssign({}, target)
    end
    local ratio = maxDistance / distance
    return {x = current.x + dx * ratio, y = current.y + dy * ratio, z = current.z + dz * ratio}
end
function Geometry.prototype.isWithinAngle(self, angle, target, tolerance)
    if tolerance == nil then
        tolerance = 0
    end
    local difference = self:normalizeAngle(angle - target)
    local shortestDifference = math.min(difference, ____exports.Geometry.FULL_TURN - difference)
    return shortestDifference <= tolerance
end
function Geometry.prototype.getAngleTo(self, from, to)
    local dx = to.x - from.x
    local dy = to.y - from.y
    local angle = math.atan2(-dx, dy) * 180 / math.pi
    return self:normalizeAngle(angle)
end
function Geometry.prototype.formatPoint(self, point)
    return (((__TS__NumberToFixed(point.x, 2) .. ", ") .. __TS__NumberToFixed(point.y, 2)) .. ", ") .. __TS__NumberToFixed(point.z, 2)
end
function Geometry.prototype.normalizeAngle(self, angle)
    local ____exports_Geometry_0 = ____exports.Geometry
    local FULL_TURN = ____exports_Geometry_0.FULL_TURN
    return (angle % FULL_TURN + FULL_TURN) % FULL_TURN
end
Geometry.FULL_TURN = 360
return ____exports
 end,
["toolkit.geometry.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____geometry = require("toolkit.geometry.src.geometry")
    ____exports.Geometry = ____geometry.Geometry
end
return ____exports
 end,
["core.game.src.actor.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.game.src.actor.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____animation = require("core.game.src.actor.animation")
    ____exports.ANIMATIONS = ____animation.ANIMATIONS
end
return ____exports
 end,
["toolkit.timings.src.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["toolkit.timings.src.manual-time"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__NumberIsInteger = ____lualib.__TS__NumberIsInteger
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
--- Первый день в полночь
local DEFAULT_STATE = {day = 1, hours = 0, minutes = 0}
--- Время, которое меняется только через set. Нужно в тестах: время такое, какое нужно тесту. Можно
-- воссоздать из слепка другого времени (см. ITime.getState)
____exports.ManualTime = __TS__Class()
local ManualTime = ____exports.ManualTime
ManualTime.name = "ManualTime"
function ManualTime.prototype.____constructor(self, state)
    if state == nil then
        state = DEFAULT_STATE
    end
    self.state = DEFAULT_STATE
    self:set(state)
end
function ManualTime.prototype.getState(self)
    local ____self_state_0 = self.state
    local day = ____self_state_0.day
    local hours = ____self_state_0.hours
    local minutes = ____self_state_0.minutes
    return {day = day, hours = hours, minutes = minutes}
end
function ManualTime.prototype.set(self, state)
    local ____state_1 = state
    local day = ____state_1.day
    local hours = ____state_1.hours
    local minutes = ____state_1.minutes
    if not __TS__NumberIsInteger(day) or day < 1 then
        error(
            __TS__New(RangeError, "День должен быть целым числом от 1"),
            0
        )
    end
    if not __TS__NumberIsInteger(hours) or hours < 0 or hours > 23 then
        error(
            __TS__New(RangeError, "Час должен быть целым числом от 0 до 23"),
            0
        )
    end
    if not __TS__NumberIsInteger(minutes) or minutes < 0 or minutes > 59 then
        error(
            __TS__New(RangeError, "Минуты должны быть целым числом от 0 до 59"),
            0
        )
    end
    self.state = {day = day, hours = hours, minutes = minutes}
end
__TS__SetDescriptor(
    ManualTime.prototype,
    "day",
    {get = function(self)
        return self.state.day
    end},
    true
)
__TS__SetDescriptor(
    ManualTime.prototype,
    "hours",
    {get = function(self)
        return self.state.hours
    end},
    true
)
__TS__SetDescriptor(
    ManualTime.prototype,
    "minutes",
    {get = function(self)
        return self.state.minutes
    end},
    true
)
return ____exports
 end,
["toolkit.timings.src.manual-timer"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Set = ____lualib.Set
local __TS__New = ____lualib.__TS__New
local __TS__NumberIsFinite = ____lualib.__TS__NumberIsFinite
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__Iterator = ____lualib.__TS__Iterator
local ____exports = {}
local ____events = require("toolkit.events.src.index")
local Observable = ____events.Observable
--- Таймер, время которого идёт, только когда вызывают advance. Нужен в тестах: время идёт тогда,
-- когда этого хочет тест
____exports.ManualTimer = __TS__Class()
local ManualTimer = ____exports.ManualTimer
ManualTimer.name = "ManualTimer"
function ManualTimer.prototype.____constructor(self)
    self.now = 0
    self.intervals = __TS__New(Set)
end
function ManualTimer.prototype.interval(self, period)
    if not __TS__NumberIsFinite(period) or period <= 0 then
        error(
            __TS__New(RangeError, "Период интервала должен быть положительным конечным числом"),
            0
        )
    end
    return __TS__New(
        Observable,
        function(subscriber)
            local interval = {period = period, nextAt = self.now + period, subscriber = subscriber}
            self.intervals:add(interval)
            subscriber:addTeardown(function() return self.intervals:delete(interval) end)
        end
    )
end
function ManualTimer.prototype.advance(self, ms)
    if not __TS__NumberIsFinite(ms) or ms < 0 then
        error(
            __TS__New(RangeError, "Время можно продвинуть только на неотрицательное конечное число"),
            0
        )
    end
    local target = self.now + ms
    local interval = self:findNextInterval(target)
    while interval do
        self.now = interval.nextAt
        interval.nextAt = interval.nextAt + interval.period
        interval.subscriber:next(interval.period)
        interval = self:findNextInterval(target)
    end
    self.now = target
end
function ManualTimer.prototype.findNextInterval(self, ____until)
    local next = nil
    for ____, interval in __TS__Iterator(self.intervals) do
        if interval.nextAt <= ____until and (not next or interval.nextAt < next.nextAt) then
            next = interval
        end
    end
    return next
end
return ____exports
 end,
["toolkit.timings.src.timer"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____events = require("toolkit.events.src.index")
local Observable = ____events.Observable
--- Таймер, который отсчитывает настоящее время
____exports.Timer = __TS__Class()
local Timer = ____exports.Timer
Timer.name = "Timer"
function Timer.prototype.____constructor(self)
end
function Timer.prototype.interval(self, period)
    return __TS__New(
        Observable,
        function(subscriber)
            local intervalId = setInterval(
                function() return subscriber:next(period) end,
                period
            )
            subscriber:addTeardown(function() return clearInterval(intervalId) end)
        end
    )
end
return ____exports
 end,
["toolkit.timings.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____manual_2Dtime = require("toolkit.timings.src.manual-time")
    ____exports.ManualTime = ____manual_2Dtime.ManualTime
end
do
    local ____manual_2Dtimer = require("toolkit.timings.src.manual-timer")
    ____exports.ManualTimer = ____manual_2Dtimer.ManualTimer
end
do
    local ____timer = require("toolkit.timings.src.timer")
    ____exports.Timer = ____timer.Timer
end
return ____exports
 end,
["core.game.src.object"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.game.src.game"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.game.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____export = require("core.game.src.actor.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("core.game.src.game")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("core.game.src.object")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
return ____exports
 end,
["core.animation-manager.src.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.animation-manager.src.animation-manager"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__NumberIsFinite = ____lualib.__TS__NumberIsFinite
local ____exports = {}
local assertPlaybackDuration
local ____events = require("toolkit.events.src.index")
local Observable = ____events.Observable
local ____game = require("core.game.src.index")
local ANIMATIONS = ____game.ANIMATIONS
function assertPlaybackDuration(animation, loop, duration)
    if not loop and duration ~= nil then
        error(
            __TS__New(Error, ("Для незацикленной анимации " .. animation) .. " нельзя передать время проигрывания"),
            0
        )
    end
    if duration ~= nil and (not __TS__NumberIsFinite(duration) or duration <= 0) then
        error(
            __TS__New(RangeError, "Время проигрывания должно быть положительным конечным числом"),
            0
        )
    end
end
--- Менеджер анимаций. Проверяет параметры по таблице анимаций и ANIMATIONS, а загрузку отдаёт
-- загрузчику. Анимации с одним ключом загрузки делят одну загрузку, поэтому менеджер должен быть
-- один на игру
____exports.AnimationManager = __TS__Class()
local AnimationManager = ____exports.AnimationManager
AnimationManager.name = "AnimationManager"
function AnimationManager.prototype.____constructor(self, options, deps)
    self.animations = __TS__ObjectAssign({}, options.animations)
    self.deps = deps
    self.loads = __TS__New(Map)
end
function AnimationManager.prototype.resolve(self, animation, playbackDuration)
    local ____ANIMATIONS_animation_0 = ANIMATIONS[animation]
    local loop = ____ANIMATIONS_animation_0.loop
    assertPlaybackDuration(animation, loop, playbackDuration)
    local record = self:getRecord(animation)
    local duration = record.duration
    if playbackDuration == nil and duration == nil then
        error(
            __TS__New(Error, "Не задана длительность анимации " .. animation),
            0
        )
    end
    return {animation = record, duration = playbackDuration or record.duration, loop = loop}
end
function AnimationManager.prototype.acquire(self, animation)
    local record = self:getRecord(animation)
    return __TS__New(
        Observable,
        function(subscriber)
            local load = self:getLoad(record)
            local loaded = load.loaded
            load.observable:subscribe(
                {
                    next = function() return subscriber:next() end,
                    error = function(____, ____error) return subscriber:error(____error) end
                },
                {signal = subscriber.signal}
            )
            if loaded then
                subscriber:next()
            end
        end
    )
end
function AnimationManager.prototype.getRecord(self, animation)
    local record = self.animations[animation]
    if not record then
        error(
            __TS__New(Error, ("Анимации " .. animation) .. " нет в таблице анимаций"),
            0
        )
    end
    return record
end
function AnimationManager.prototype.getLoad(self, record)
    local ____self_deps_1 = self.deps
    local loader = ____self_deps_1.loader
    local key = loader:key(record)
    local existing = self.loads:get(key)
    if existing then
        return existing
    end
    local load
    load = {
        loaded = false,
        observable = __TS__New(
            Observable,
            function(subscriber)
                subscriber:addTeardown(function()
                    load.loaded = false
                    return false
                end)
                loader:load(record):subscribe(
                    {
                        next = function()
                            load.loaded = true
                            subscriber:next()
                        end,
                        error = function(____, ____error) return subscriber:error(____error) end
                    },
                    {signal = subscriber.signal}
                )
            end
        )
    }
    self.loads:set(key, load)
    return load
end
return ____exports
 end,
["core.animation-manager.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____animation_2Dmanager = require("core.animation-manager.src.animation-manager")
    ____exports.AnimationManager = ____animation_2Dmanager.AnimationManager
end
return ____exports
 end,
["moonloader.src.audio"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.loadAudioStream = _G.loadAudioStream
____exports.playAudioStream = _G.playAudioStream
____exports.stopAudioStream = _G.stopAudioStream
____exports.getAudioStreamLength = _G.getAudioStreamLength
____exports.setAudioStreamVolume = _G.setAudioStreamVolume
____exports.getAudioStreamState = _G.getAudioStreamState
____exports.playSoundFrontend = _G.playSoundFrontend
____exports.addOneOffSound = _G.addOneOffSound
return ____exports
 end,
["moonloader.src.handles"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["moonloader.src.char"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.createChar = _G.createChar
____exports.createCharInsideCar = _G.createCharInsideCar
____exports.createCharAsPassenger = _G.createCharAsPassenger
____exports.deleteChar = _G.deleteChar
____exports.doesCharExist = _G.doesCharExist
____exports.setCharHeading = _G.setCharHeading
____exports.getCharHeading = _G.getCharHeading
____exports.getCharCoordinates = _G.getCharCoordinates
____exports.setCharCoordinates = _G.setCharCoordinates
____exports.dontRemoveChar = _G.dontRemoveChar
____exports.setLoadCollisionForCharFlag = _G.setLoadCollisionForCharFlag
____exports.isCharDead = _G.isCharDead
____exports.isCharPlayingAnim = _G.isCharPlayingAnim
____exports.setCharHealth = _G.setCharHealth
____exports.setCharCollision = _G.setCharCollision
____exports.setCharNeverTargetted = _G.setCharNeverTargetted
____exports.getCharHealth = _G.getCharHealth
____exports.setCharArmour = _G.setCharArmour
____exports.getCharArmour = _G.getCharArmour
____exports.giveWeaponToChar = _G.giveWeaponToChar
____exports.removeWeaponFromChar = _G.removeWeaponFromChar
____exports.setCurrentCharWeapon = _G.setCurrentCharWeapon
____exports.getCurrentCharWeapon = _G.getCurrentCharWeapon
____exports.setCharAccuracy = _G.setCharAccuracy
____exports.ignoreHeightDifferenceFollowingNodes = _G.ignoreHeightDifferenceFollowingNodes
____exports.taskAchieveHeading = _G.taskAchieveHeading
____exports.taskEnterCarAsDriver = _G.taskEnterCarAsDriver
____exports.taskEnterCarAsPassenger = _G.taskEnterCarAsPassenger
____exports.taskLeaveAnyCar = _G.taskLeaveAnyCar
____exports.taskGoToCoordAnyMeans = _G.taskGoToCoordAnyMeans
____exports.taskGoStraightToCoord = _G.taskGoStraightToCoord
____exports.taskGotoChar = _G.taskGotoChar
____exports.taskGoToObject = _G.taskGoToObject
____exports.taskGotoCharAiming = _G.taskGotoCharAiming
____exports.taskGotoCharOffset = _G.taskGotoCharOffset
____exports.taskFollowPathNodesToCoord = _G.taskFollowPathNodesToCoord
____exports.taskPlayAnim = _G.taskPlayAnim
____exports.taskDie = _G.taskDie
____exports.taskWanderStandard = _G.taskWanderStandard
____exports.taskCombat = _G.taskCombat
____exports.clearCharTasks = _G.clearCharTasks
____exports.clearCharTasksImmediately = _G.clearCharTasksImmediately
____exports.isCharInAnyCar = _G.isCharInAnyCar
____exports.isCharInCar = _G.isCharInCar
____exports.isCharInArea2d = _G.isCharInArea2d
____exports.isCharInArea3d = _G.isCharInArea3d
____exports.getCarCharIsUsing = _G.getCarCharIsUsing
____exports.findAllRandomCharsInSphere = _G.findAllRandomCharsInSphere
____exports.setCharVisible = _G.setCharVisible
____exports.setCharMoney = _G.setCharMoney
____exports.freezeCharPosition = _G.freezeCharPosition
____exports.setCharProofs = _G.setCharProofs
____exports.setCharCanBeKnockedOffBike = _G.setCharCanBeKnockedOffBike
____exports.setCharCanBeDraggedOut = _G.setCharCanBeDraggedOut
____exports.setCharCanBeShotInVehicle = _G.setCharCanBeShotInVehicle
____exports.getCharSpeed = _G.getCharSpeed
____exports.setCharMaxHealth = _G.setCharMaxHealth
return ____exports
 end,
["moonloader.src.constants"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
--- Типы пешеходов
____exports.PedType = ____exports.PedType or ({})
____exports.PedType.PLAYER1 = 0
____exports.PedType[____exports.PedType.PLAYER1] = "PLAYER1"
____exports.PedType.PLAYER2 = 1
____exports.PedType[____exports.PedType.PLAYER2] = "PLAYER2"
____exports.PedType.PLAYER_NETWORK = 2
____exports.PedType[____exports.PedType.PLAYER_NETWORK] = "PLAYER_NETWORK"
____exports.PedType.PLAYER_UNUSED = 3
____exports.PedType[____exports.PedType.PLAYER_UNUSED] = "PLAYER_UNUSED"
____exports.PedType.CIVMALE = 4
____exports.PedType[____exports.PedType.CIVMALE] = "CIVMALE"
____exports.PedType.CIVFEMALE = 5
____exports.PedType[____exports.PedType.CIVFEMALE] = "CIVFEMALE"
____exports.PedType.COP = 6
____exports.PedType[____exports.PedType.COP] = "COP"
____exports.PedType.GANG = 7
____exports.PedType[____exports.PedType.GANG] = "GANG"
____exports.PedType.DEALER = 8
____exports.PedType[____exports.PedType.DEALER] = "DEALER"
____exports.PedType.MEDIC = 9
____exports.PedType[____exports.PedType.MEDIC] = "MEDIC"
____exports.PedType.FIREMAN = 10
____exports.PedType[____exports.PedType.FIREMAN] = "FIREMAN"
____exports.PedType.CRIMINAL = 11
____exports.PedType[____exports.PedType.CRIMINAL] = "CRIMINAL"
____exports.PedType.SPECIAL = 12
____exports.PedType[____exports.PedType.SPECIAL] = "SPECIAL"
____exports.PedType.PROSTITUTE = 13
____exports.PedType[____exports.PedType.PROSTITUTE] = "PROSTITUTE"
--- Типы оружия
____exports.WeaponType = ____exports.WeaponType or ({})
____exports.WeaponType.FIST = 0
____exports.WeaponType[____exports.WeaponType.FIST] = "FIST"
____exports.WeaponType.BRASSKNUCKLE = 1
____exports.WeaponType[____exports.WeaponType.BRASSKNUCKLE] = "BRASSKNUCKLE"
____exports.WeaponType.GOLFCLUB = 2
____exports.WeaponType[____exports.WeaponType.GOLFCLUB] = "GOLFCLUB"
____exports.WeaponType.NIGHTSTICK = 3
____exports.WeaponType[____exports.WeaponType.NIGHTSTICK] = "NIGHTSTICK"
____exports.WeaponType.KNIFE = 4
____exports.WeaponType[____exports.WeaponType.KNIFE] = "KNIFE"
____exports.WeaponType.BASEBALLBAT = 5
____exports.WeaponType[____exports.WeaponType.BASEBALLBAT] = "BASEBALLBAT"
____exports.WeaponType.SHOVEL = 6
____exports.WeaponType[____exports.WeaponType.SHOVEL] = "SHOVEL"
____exports.WeaponType.POOLSTICK = 7
____exports.WeaponType[____exports.WeaponType.POOLSTICK] = "POOLSTICK"
____exports.WeaponType.KATANA = 8
____exports.WeaponType[____exports.WeaponType.KATANA] = "KATANA"
____exports.WeaponType.CHAINSAW = 9
____exports.WeaponType[____exports.WeaponType.CHAINSAW] = "CHAINSAW"
____exports.WeaponType.DILDO = 10
____exports.WeaponType[____exports.WeaponType.DILDO] = "DILDO"
____exports.WeaponType.VIBRATOR = 11
____exports.WeaponType[____exports.WeaponType.VIBRATOR] = "VIBRATOR"
____exports.WeaponType.FLOWER = 14
____exports.WeaponType[____exports.WeaponType.FLOWER] = "FLOWER"
____exports.WeaponType.CANE = 15
____exports.WeaponType[____exports.WeaponType.CANE] = "CANE"
____exports.WeaponType.GRENADE = 16
____exports.WeaponType[____exports.WeaponType.GRENADE] = "GRENADE"
____exports.WeaponType.TEARGAS = 17
____exports.WeaponType[____exports.WeaponType.TEARGAS] = "TEARGAS"
____exports.WeaponType.MOLOTOV = 18
____exports.WeaponType[____exports.WeaponType.MOLOTOV] = "MOLOTOV"
____exports.WeaponType.COLT45 = 22
____exports.WeaponType[____exports.WeaponType.COLT45] = "COLT45"
____exports.WeaponType.SILENCED = 23
____exports.WeaponType[____exports.WeaponType.SILENCED] = "SILENCED"
____exports.WeaponType.DEAGLE = 24
____exports.WeaponType[____exports.WeaponType.DEAGLE] = "DEAGLE"
____exports.WeaponType.SHOTGUN = 25
____exports.WeaponType[____exports.WeaponType.SHOTGUN] = "SHOTGUN"
____exports.WeaponType.SAWEDOFF = 26
____exports.WeaponType[____exports.WeaponType.SAWEDOFF] = "SAWEDOFF"
____exports.WeaponType.SHOTGSPA = 27
____exports.WeaponType[____exports.WeaponType.SHOTGSPA] = "SHOTGSPA"
____exports.WeaponType.UZI = 28
____exports.WeaponType[____exports.WeaponType.UZI] = "UZI"
____exports.WeaponType.MP5 = 29
____exports.WeaponType[____exports.WeaponType.MP5] = "MP5"
____exports.WeaponType.AK47 = 30
____exports.WeaponType[____exports.WeaponType.AK47] = "AK47"
____exports.WeaponType.M4 = 31
____exports.WeaponType[____exports.WeaponType.M4] = "M4"
____exports.WeaponType.TEC9 = 32
____exports.WeaponType[____exports.WeaponType.TEC9] = "TEC9"
____exports.WeaponType.RIFLE = 33
____exports.WeaponType[____exports.WeaponType.RIFLE] = "RIFLE"
____exports.WeaponType.SNIPER = 34
____exports.WeaponType[____exports.WeaponType.SNIPER] = "SNIPER"
____exports.WeaponType.ROCKETLAUNCHER = 35
____exports.WeaponType[____exports.WeaponType.ROCKETLAUNCHER] = "ROCKETLAUNCHER"
____exports.WeaponType.HEATSEEKER = 36
____exports.WeaponType[____exports.WeaponType.HEATSEEKER] = "HEATSEEKER"
____exports.WeaponType.FLAMETHROWER = 37
____exports.WeaponType[____exports.WeaponType.FLAMETHROWER] = "FLAMETHROWER"
____exports.WeaponType.MINIGUN = 38
____exports.WeaponType[____exports.WeaponType.MINIGUN] = "MINIGUN"
____exports.WeaponType.SATCHEL = 39
____exports.WeaponType[____exports.WeaponType.SATCHEL] = "SATCHEL"
____exports.WeaponType.BOMB = 40
____exports.WeaponType[____exports.WeaponType.BOMB] = "BOMB"
____exports.WeaponType.SPRAYCAN = 41
____exports.WeaponType[____exports.WeaponType.SPRAYCAN] = "SPRAYCAN"
____exports.WeaponType.FIREEXTINGUISHER = 42
____exports.WeaponType[____exports.WeaponType.FIREEXTINGUISHER] = "FIREEXTINGUISHER"
____exports.WeaponType.CAMERA = 43
____exports.WeaponType[____exports.WeaponType.CAMERA] = "CAMERA"
____exports.WeaponType.PARACHUTE = 46
____exports.WeaponType[____exports.WeaponType.PARACHUTE] = "PARACHUTE"
____exports.WeaponType.VEHICLE = 49
____exports.WeaponType[____exports.WeaponType.VEHICLE] = "VEHICLE"
____exports.WeaponType.DROWN = 53
____exports.WeaponType[____exports.WeaponType.DROWN] = "DROWN"
____exports.WeaponType.COLLISION = 54
____exports.WeaponType[____exports.WeaponType.COLLISION] = "COLLISION"
--- Типы погоды
____exports.WeatherType = ____exports.WeatherType or ({})
____exports.WeatherType.EXTRASUNNY_LA = 0
____exports.WeatherType[____exports.WeatherType.EXTRASUNNY_LA] = "EXTRASUNNY_LA"
____exports.WeatherType.SUNNY_LA = 1
____exports.WeatherType[____exports.WeatherType.SUNNY_LA] = "SUNNY_LA"
____exports.WeatherType.EXTRASUNNY_SMOG_LA = 2
____exports.WeatherType[____exports.WeatherType.EXTRASUNNY_SMOG_LA] = "EXTRASUNNY_SMOG_LA"
____exports.WeatherType.SUNNY_SMOG_LA = 3
____exports.WeatherType[____exports.WeatherType.SUNNY_SMOG_LA] = "SUNNY_SMOG_LA"
____exports.WeatherType.CLOUDY_LA = 4
____exports.WeatherType[____exports.WeatherType.CLOUDY_LA] = "CLOUDY_LA"
____exports.WeatherType.SUNNY_SF = 5
____exports.WeatherType[____exports.WeatherType.SUNNY_SF] = "SUNNY_SF"
____exports.WeatherType.EXTRASUNNY_SF = 6
____exports.WeatherType[____exports.WeatherType.EXTRASUNNY_SF] = "EXTRASUNNY_SF"
____exports.WeatherType.CLOUDY_SF = 7
____exports.WeatherType[____exports.WeatherType.CLOUDY_SF] = "CLOUDY_SF"
____exports.WeatherType.RAINY_SF = 8
____exports.WeatherType[____exports.WeatherType.RAINY_SF] = "RAINY_SF"
____exports.WeatherType.FOGGY_SF = 9
____exports.WeatherType[____exports.WeatherType.FOGGY_SF] = "FOGGY_SF"
____exports.WeatherType.SUNNY_VEGAS = 10
____exports.WeatherType[____exports.WeatherType.SUNNY_VEGAS] = "SUNNY_VEGAS"
____exports.WeatherType.EXTRASUNNY_VEGAS = 11
____exports.WeatherType[____exports.WeatherType.EXTRASUNNY_VEGAS] = "EXTRASUNNY_VEGAS"
____exports.WeatherType.CLOUDY_VEGAS = 12
____exports.WeatherType[____exports.WeatherType.CLOUDY_VEGAS] = "CLOUDY_VEGAS"
____exports.WeatherType.EXTRASUNNY_COUNTRYSIDE = 13
____exports.WeatherType[____exports.WeatherType.EXTRASUNNY_COUNTRYSIDE] = "EXTRASUNNY_COUNTRYSIDE"
____exports.WeatherType.SUNNY_COUNTRYSIDE = 14
____exports.WeatherType[____exports.WeatherType.SUNNY_COUNTRYSIDE] = "SUNNY_COUNTRYSIDE"
____exports.WeatherType.CLOUDY_COUNTRYSIDE = 15
____exports.WeatherType[____exports.WeatherType.CLOUDY_COUNTRYSIDE] = "CLOUDY_COUNTRYSIDE"
____exports.WeatherType.RAINY_COUNTRYSIDE = 16
____exports.WeatherType[____exports.WeatherType.RAINY_COUNTRYSIDE] = "RAINY_COUNTRYSIDE"
____exports.WeatherType.EXTRASUNNY_DESERT = 17
____exports.WeatherType[____exports.WeatherType.EXTRASUNNY_DESERT] = "EXTRASUNNY_DESERT"
____exports.WeatherType.SUNNY_DESERT = 18
____exports.WeatherType[____exports.WeatherType.SUNNY_DESERT] = "SUNNY_DESERT"
____exports.WeatherType.SANDSTORM_DESERT = 19
____exports.WeatherType[____exports.WeatherType.SANDSTORM_DESERT] = "SANDSTORM_DESERT"
____exports.WeatherType.UNDERWATER = 20
____exports.WeatherType[____exports.WeatherType.UNDERWATER] = "UNDERWATER"
____exports.WeatherType.EXTRACOLOURS_1 = 21
____exports.WeatherType[____exports.WeatherType.EXTRACOLOURS_1] = "EXTRACOLOURS_1"
____exports.WeatherType.EXTRACOLOURS_2 = 22
____exports.WeatherType[____exports.WeatherType.EXTRACOLOURS_2] = "EXTRACOLOURS_2"
--- Модели транспорта
____exports.VehicleModel = ____exports.VehicleModel or ({})
____exports.VehicleModel.LANDSTALKER = 400
____exports.VehicleModel[____exports.VehicleModel.LANDSTALKER] = "LANDSTALKER"
____exports.VehicleModel.BRAVURA = 401
____exports.VehicleModel[____exports.VehicleModel.BRAVURA] = "BRAVURA"
____exports.VehicleModel.BUFFALO = 402
____exports.VehicleModel[____exports.VehicleModel.BUFFALO] = "BUFFALO"
____exports.VehicleModel.LINERUNNER = 403
____exports.VehicleModel[____exports.VehicleModel.LINERUNNER] = "LINERUNNER"
____exports.VehicleModel.PERENNIAL = 404
____exports.VehicleModel[____exports.VehicleModel.PERENNIAL] = "PERENNIAL"
____exports.VehicleModel.SENTINEL = 405
____exports.VehicleModel[____exports.VehicleModel.SENTINEL] = "SENTINEL"
____exports.PLAYER_PED = _G.PLAYER_PED
____exports.PLAYER_HANDLE = _G.PLAYER_HANDLE
return ____exports
 end,
["moonloader.src.dialogs"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.isDialogActive = _G.isDialogActive
____exports.showDialog = _G.showDialog
____exports.processDialogResponse = _G.processDialogResponse
____exports.showTextdraw = _G.showTextdraw
____exports.hideTextdraw = _G.hideTextdraw
return ____exports
 end,
["moonloader.src.lua"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.LuaScript = LuaScript
____exports.LuaThread = LuaThread
____exports.lua_thread = _G.lua_thread
____exports.math = _G.math
____exports.os = _G.os
return ____exports
 end,
["moonloader.src.events"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.addEventHandler = _G.addEventHandler
return ____exports
 end,
["moonloader.src.file-system"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.doesFileExist = _G.doesFileExist
____exports.doesDirectoryExist = _G.doesDirectoryExist
____exports.createDirectory = _G.createDirectory
____exports.getWorkingDirectory = _G.getWorkingDirectory
____exports.getGameDirectory = _G.getGameDirectory
return ____exports
 end,
["moonloader.src.marker"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.createCheckpoint = _G.createCheckpoint
____exports.deleteCheckpoint = _G.deleteCheckpoint
____exports.addBlipForCoord = _G.addBlipForCoord
____exports.addBlipForChar = _G.addBlipForChar
____exports.addBlipForCar = _G.addBlipForCar
____exports.addBlipForObject = _G.addBlipForObject
____exports.addBlipForContactPoint = _G.addBlipForContactPoint
____exports.removeBlip = _G.removeBlip
____exports.doesBlipExist = _G.doesBlipExist
____exports.changeBlipColour = _G.changeBlipColour
____exports.changeBlipScale = _G.changeBlipScale
____exports.changeBlipDisplay = _G.changeBlipDisplay
____exports.getBlipCoords = _G.getBlipCoords
return ____exports
 end,
["moonloader.src.math"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.generateRandomFloatInRange = _G.generateRandomFloatInRange
____exports.generateRandomIntInRange = _G.generateRandomIntInRange
____exports.limitAngle = _G.limitAngle
return ____exports
 end,
["moonloader.src.models"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.requestModel = _G.requestModel
____exports.loadAllModelsNow = _G.loadAllModelsNow
____exports.hasModelLoaded = _G.hasModelLoaded
____exports.markModelAsNoLongerNeeded = _G.markModelAsNoLongerNeeded
____exports.requestSpecialModel = _G.requestSpecialModel
____exports.hasSpecialCharacterLoaded = _G.hasSpecialCharacterLoaded
____exports.requestAnimation = _G.requestAnimation
____exports.hasAnimationLoaded = _G.hasAnimationLoaded
____exports.removeAnimation = _G.removeAnimation
return ____exports
 end,
["moonloader.src.network"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.getPlayerName = _G.getPlayerName
____exports.getPlayerPing = _G.getPlayerPing
____exports.getServerAddress = _G.getServerAddress
____exports.sendServerCommand = _G.sendServerCommand
____exports.sendChat = _G.sendChat
____exports.isPlayerConnected = _G.isPlayerConnected
____exports.getPlayerScore = _G.getPlayerScore
____exports.isPlayerPaused = _G.isPlayerPaused
return ____exports
 end,
["moonloader.src.object"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.createObject = _G.createObject
____exports.createObjectNoOffset = _G.createObjectNoOffset
____exports.deleteObject = _G.deleteObject
____exports.doesObjectExist = _G.doesObjectExist
____exports.setObjectCoordinates = _G.setObjectCoordinates
____exports.getObjectCoordinates = _G.getObjectCoordinates
____exports.setObjectHeading = _G.setObjectHeading
____exports.getObjectHeading = _G.getObjectHeading
____exports.attachObjectToCar = _G.attachObjectToCar
____exports.attachObjectToChar = _G.attachObjectToChar
____exports.detachObject = _G.detachObject
____exports.setObjectCollision = _G.setObjectCollision
____exports.setObjectVisible = _G.setObjectVisible
____exports.setObjectDynamic = _G.setObjectDynamic
____exports.setObjectProofs = _G.setObjectProofs
____exports.freezeObjectPosition = _G.freezeObjectPosition
return ____exports
 end,
["moonloader.src.pickups"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.createPickup = _G.createPickup
____exports.removePickup = _G.removePickup
____exports.doesPickupExist = _G.doesPickupExist
____exports.hasPickupBeenCollected = _G.hasPickupBeenCollected
return ____exports
 end,
["moonloader.src.player"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.getPlayerChar = _G.getPlayerChar
____exports.getPlayerId = _G.getPlayerId
____exports.getActivePlayerCoords = _G.getActivePlayerCoords
____exports.setPlayerCoordinates = _G.setPlayerCoordinates
____exports.getCameraFrontVector = _G.getCameraFrontVector
____exports.getCameraCoordinates = _G.getCameraCoordinates
____exports.setCameraPosition = _G.setCameraPosition
____exports.pointCameraAtPoint = _G.pointCameraAtPoint
____exports.pointCameraAtChar = _G.pointCameraAtChar
____exports.restoreCameraJumpcut = _G.restoreCameraJumpcut
____exports.setPlayerControl = _G.setPlayerControl
____exports.getPlayerMoney = _G.getPlayerMoney
____exports.setPlayerMoney = _G.setPlayerMoney
____exports.addToPlayerMoney = _G.addToPlayerMoney
____exports.getPlayerWantedLevel = _G.getPlayerWantedLevel
____exports.alterWantedLevel = _G.alterWantedLevel
____exports.clearWantedLevel = _G.clearWantedLevel
____exports.setMaxWantedLevel = _G.setMaxWantedLevel
____exports.isPlayerPlayingAsChar = _G.isPlayerPlayingAsChar
____exports.isPlayerDead = _G.isPlayerDead
return ____exports
 end,
["moonloader.src.system"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.print = _G.print
____exports.wait = _G.wait
____exports.printStringNow = _G.printStringNow
____exports.printString = _G.printString
____exports.printStringWithLiteralStringNow = _G.printStringWithLiteralStringNow
____exports.printBig = _G.printBig
____exports.clearPrints = _G.clearPrints
____exports.isHelpMessageBeingDisplayed = _G.isHelpMessageBeingDisplayed
____exports.isKeyPressed = _G.isKeyPressed
____exports.wasKeyPressed = _G.wasKeyPressed
____exports.thisScript = _G.thisScript
____exports.unloadScript = _G.unloadScript
____exports.reloadScript = _G.reloadScript
____exports.getAllScripts = _G.getAllScripts
____exports.isScriptLoaded = _G.isScriptLoaded
____exports.localClock = _G.localClock
____exports.getFramerate = _G.getFramerate
____exports.isGamePaused = _G.isGamePaused
____exports.getGameVersion = _G.getGameVersion
____exports.getPlayerPointer = _G.getPlayerPointer
____exports.isPlayerPlaying = _G.isPlayerPlaying
return ____exports
 end,
["moonloader.src.text"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.displayText = _G.displayText
____exports.setTextScale = _G.setTextScale
____exports.setTextColour = _G.setTextColour
____exports.setTextFont = _G.setTextFont
____exports.setTextJustify = _G.setTextJustify
____exports.setTextEdge = _G.setTextEdge
____exports.setTextProportional = _G.setTextProportional
____exports.setTextCentre = _G.setTextCentre
____exports.setTextWrapx = _G.setTextWrapx
____exports.setTextDropshadow = _G.setTextDropshadow
____exports.drawRect = _G.drawRect
____exports.drawTexture = _G.drawTexture
____exports.getScreenResolution = _G.getScreenResolution
____exports.convert3dCoordsToScreen = _G.convert3dCoordsToScreen
____exports.convertScreenCoordsTo3d = _G.convertScreenCoordsTo3d
return ____exports
 end,
["moonloader.src.vehicle"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.createCar = _G.createCar
____exports.deleteCar = _G.deleteCar
____exports.doesVehicleExist = _G.doesVehicleExist
____exports.setCarCoordinates = _G.setCarCoordinates
____exports.getCarCoordinates = _G.getCarCoordinates
____exports.setCarHeading = _G.setCarHeading
____exports.getCarHeading = _G.getCarHeading
____exports.setCarHealth = _G.setCarHealth
____exports.getCarHealth = _G.getCarHealth
____exports.changeCarColour = _G.changeCarColour
____exports.getCarColours = _G.getCarColours
____exports.explodeCar = _G.explodeCar
____exports.fixCar = _G.fixCar
____exports.lockCarDoors = _G.lockCarDoors
____exports.switchCarSiren = _G.switchCarSiren
____exports.forceCarLights = _G.forceCarLights
____exports.setCarProofs = _G.setCarProofs
____exports.getCarModel = _G.getCarModel
____exports.getCarSpeed = _G.getCarSpeed
____exports.setCarForwardSpeed = _G.setCarForwardSpeed
____exports.getDriverOfCar = _G.getDriverOfCar
____exports.getNumberOfPassengers = _G.getNumberOfPassengers
____exports.getMaximumNumberOfPassengers = _G.getMaximumNumberOfPassengers
____exports.isCarPassengerSeatFree = _G.isCarPassengerSeatFree
____exports.getCharInCarPassengerSeat = _G.getCharInCarPassengerSeat
____exports.freezeCarPosition = _G.freezeCarPosition
____exports.markCarAsNoLongerNeeded = _G.markCarAsNoLongerNeeded
____exports.setCarVisible = _G.setCarVisible
____exports.isCarInWater = _G.isCarInWater
____exports.isCarInAirProper = _G.isCarInAirProper
____exports.isCarUpsidedown = _G.isCarUpsidedown
____exports.dontProcessVehicleRecordingsNearNetworkPlayers = _G.dontProcessVehicleRecordingsNearNetworkPlayers
return ____exports
 end,
["moonloader.src.world"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.setWeather = _G.setWeather
____exports.getCurrentWeather = _G.getCurrentWeather
____exports.forceWeather = _G.forceWeather
____exports.forceWeatherNow = _G.forceWeatherNow
____exports.releaseWeather = _G.releaseWeather
____exports.setTimeOfDay = _G.setTimeOfDay
____exports.getTimeOfDay = _G.getTimeOfDay
____exports.getMinutesToTimeOfDay = _G.getMinutesToTimeOfDay
____exports.storeClockState = _G.storeClockState
____exports.restoreClockState = _G.restoreClockState
____exports.setGravity = _G.setGravity
____exports.setTimeScale = _G.setTimeScale
____exports.getDistanceBetweenCoords2d = _G.getDistanceBetweenCoords2d
____exports.getDistanceBetweenCoords3d = _G.getDistanceBetweenCoords3d
____exports.getHeadingFromVector2d = _G.getHeadingFromVector2d
____exports.getGroundZFor3dCoord = _G.getGroundZFor3dCoord
____exports.getClosestCharNode = _G.getClosestCharNode
____exports.addExplosion = _G.addExplosion
____exports.startScriptFire = _G.startScriptFire
____exports.removeScriptFire = _G.removeScriptFire
____exports.isScriptFireExtinguished = _G.isScriptFireExtinguished
return ____exports
 end,
["moonloader.src.zones"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.getNameOfZone = _G.getNameOfZone
____exports.getNameOfInfoZone = _G.getNameOfInfoZone
____exports.getCurrentZoneScavengerValue = _G.getCurrentZoneScavengerValue
return ____exports
 end,
["moonloader.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____export = require("moonloader.src.audio")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.char")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.constants")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.dialogs")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.events")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.file-system")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.handles")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.lua")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.marker")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.math")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.models")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.network")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.object")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.pickups")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.player")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.system")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.text")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.vehicle")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.world")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("moonloader.src.zones")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
return ____exports
 end,
["gta-sa.src.object.object"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
local ____moonloader = require("moonloader.src.index")
local createObjectNoOffset = ____moonloader.createObjectNoOffset
local freezeObjectPosition = ____moonloader.freezeObjectPosition
local deleteObject = ____moonloader.deleteObject
local doesObjectExist = ____moonloader.doesObjectExist
local getObjectCoordinates = ____moonloader.getObjectCoordinates
local loadAllModelsNow = ____moonloader.loadAllModelsNow
local markModelAsNoLongerNeeded = ____moonloader.markModelAsNoLongerNeeded
local requestModel = ____moonloader.requestModel
local setObjectCoordinates = ____moonloader.setObjectCoordinates
local setObjectCollision = ____moonloader.setObjectCollision
local setObjectVisible = ____moonloader.setObjectVisible
____exports.GtaObject = __TS__Class()
local GtaObject = ____exports.GtaObject
GtaObject.name = "GtaObject"
function GtaObject.prototype.____constructor(self, options)
    local ____options_0 = options
    local modelId = ____options_0.modelId
    local position = ____options_0.position
    requestModel(modelId)
    loadAllModelsNow()
    self.handle = createObjectNoOffset(modelId, position.x, position.y, position.z)
    markModelAsNoLongerNeeded(modelId)
end
function GtaObject.prototype.remove(self)
    if doesObjectExist(self.handle) then
        deleteObject(self.handle)
    end
end
function GtaObject.prototype.freeze(self)
    freezeObjectPosition(self.handle, true)
end
function GtaObject.prototype.getPosition(self)
    local x, y, z = getObjectCoordinates(self.handle)
    return {x = x, y = y, z = z}
end
function GtaObject.prototype.setCollisionEnabled(self, enabled)
    setObjectCollision(self.handle, enabled)
end
function GtaObject.prototype.setPosition(self, position)
    setObjectCoordinates(self.handle, position.x, position.y, position.z)
end
function GtaObject.prototype.setVisibility(self, visible)
    setObjectVisible(self.handle, visible)
end
return ____exports
 end,
["gta-sa.src.object.factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____object = require("gta-sa.src.object.object")
local GtaObject = ____object.GtaObject
____exports.GtaObjectFactory = __TS__Class()
local GtaObjectFactory = ____exports.GtaObjectFactory
GtaObjectFactory.name = "GtaObjectFactory"
function GtaObjectFactory.prototype.____constructor(self)
end
function GtaObjectFactory.prototype.create(self, options)
    return __TS__New(GtaObject, options)
end
return ____exports
 end,
["gta-sa.src.object.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____object = require("gta-sa.src.object.object")
    ____exports.GtaObject = ____object.GtaObject
end
do
    local ____factory = require("gta-sa.src.object.factory")
    ____exports.GtaObjectFactory = ____factory.GtaObjectFactory
end
return ____exports
 end,
["core.actor-command.src.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.actor-command.src.command"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____events = require("toolkit.events.src.index")
local AbortController = ____events.AbortController
local Observable = ____events.Observable
--- Команда актора, которая раз в период обновления вызывает onUpdate, пока он не вернёт 'success'
-- или 'failed'. Сама подписывается на таймер, завершает Observable команды и не даёт завершить или
-- прервать её повторно. Наследнику остаётся описать в хуках, что команда делает
____exports.Command = __TS__Class()
local Command = ____exports.Command
Command.name = "Command"
function Command.prototype.____constructor(self, definition, actor, options, deps)
    self.name = definition.name
    self.updatePeriod = definition.updatePeriod
    self.actor = actor
    self.options = options
    self.deps = deps
    self.controller = __TS__New(AbortController)
    self.lifetime = __TS__New(AbortController)
    self.subscriber = nil
    self.result = nil
end
function Command.prototype.execute(self)
    return __TS__New(
        Observable,
        function(subscriber)
            local ____self_controller_0 = self.controller
            local signal = ____self_controller_0.signal
            local despawn = self.actor.signal
            if signal.aborted then
                subscriber:error(signal.reason)
                return
            end
            if despawn.aborted then
                subscriber:error(despawn.reason)
                return
            end
            local function onDespawn(reason)
                return self:cancel(reason)
            end
            despawn:addEventListener("abort", onDespawn, {once = true})
            self.subscriber = subscriber
            subscriber:addTeardown(function()
                despawn:removeEventListener("abort", onDespawn)
                self:teardown()
            end)
            self:onStart()
            self:update(0)
            if signal.aborted then
                return
            end
            local ____self_deps_1 = self.deps
            local timer = ____self_deps_1.timer
            timer:interval(self.updatePeriod):subscribe(
                function(elapsed) return self:update(elapsed) end,
                {signal = signal}
            )
        end
    )
end
function Command.prototype.cancel(self, reason)
    self:finish("cancelled", reason)
end
function Command.prototype.onStart(self)
end
function Command.prototype.emit(self, value)
    local ____opt_2 = self.subscriber
    if ____opt_2 ~= nil then
        ____opt_2:next(value)
    end
end
function Command.prototype.fail(self, reason)
    self:finish("failed", reason)
end
function Command.prototype.update(self, elapsed)
    if self.controller.signal.aborted then
        return
    end
    local status = self:onUpdate(elapsed)
    if status == "success" then
        self:finish("success")
    elseif status == "failed" then
        self:fail(__TS__New(Error, ("Команда " .. self.name) .. " не выполнена"))
    end
end
function Command.prototype.finish(self, result, reason)
    if self.controller.signal.aborted then
        return
    end
    self.result = result
    self.controller:abort(reason)
    if result == "success" then
        local ____opt_4 = self.subscriber
        if ____opt_4 ~= nil then
            ____opt_4:complete()
        end
    else
        local ____opt_6 = self.subscriber
        if ____opt_6 ~= nil then
            ____opt_6:error(reason)
        end
    end
end
function Command.prototype.teardown(self)
    local result = self.result or "cancelled"
    self.controller:abort()
    self:onFinish(result)
    self.lifetime:abort()
end
__TS__SetDescriptor(
    Command.prototype,
    "signal",
    {get = function(self)
        return self.lifetime.signal
    end},
    true
)
return ____exports
 end,
["core.actor-command.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____command = require("core.actor-command.src.command")
    ____exports.Command = ____command.Command
end
return ____exports
 end,
["gta-sa.src.actor.achieve-angle-command"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____actor_2Dcommand = require("core.actor-command.src.index")
local Command = ____actor_2Dcommand.Command
local ____moonloader = require("moonloader.src.index")
local clearCharTasksImmediately = ____moonloader.clearCharTasksImmediately
local taskAchieveHeading = ____moonloader.taskAchieveHeading
--- Персонаж поворачивается быстрее секунды, поэтому команда проверяет угол часто
local ACHIEVE_ANGLE = {name = "achieve-angle", updatePeriod = 100}
--- Сколько миллисекунд персонаж может поворачиваться сам, прежде чем его повернут сразу
local TURN_TIMEOUT = 1000
--- Поворачивает игрового персонажа на угол и сообщает его угол по мере поворота. Игра поворачивает
-- персонажа не всегда до конца, поэтому, если за секунду он не повернулся, команда сразу ставит
-- ему нужный угол
____exports.GtaAchieveAngleCommand = __TS__Class()
local GtaAchieveAngleCommand = ____exports.GtaAchieveAngleCommand
GtaAchieveAngleCommand.name = "GtaAchieveAngleCommand"
__TS__ClassExtends(GtaAchieveAngleCommand, Command)
function GtaAchieveAngleCommand.prototype.____constructor(self, actor, options, deps)
    Command.prototype.____constructor(
        self,
        ACHIEVE_ANGLE,
        actor,
        options,
        deps
    )
    self.turningFor = 0
end
function GtaAchieveAngleCommand.prototype.onStart(self)
    local ____self_options_0 = self.options
    local handle = ____self_options_0.handle
    local angle = ____self_options_0.angle
    local ____self_deps_1 = self.deps
    local geometry = ____self_deps_1.geometry
    taskAchieveHeading(
        handle,
        geometry:normalizeAngle(angle)
    )
end
function GtaAchieveAngleCommand.prototype.onUpdate(self, elapsed)
    local ____self_options_2 = self.options
    local angle = ____self_options_2.angle
    local tolerance = ____self_options_2.tolerance
    local ____self_deps_3 = self.deps
    local geometry = ____self_deps_3.geometry
    self.turningFor = self.turningFor + elapsed
    if self.turningFor >= TURN_TIMEOUT then
        self.actor:setAngle(angle)
    end
    local current = self.actor:getAngle()
    self:emit(current)
    return geometry:isWithinAngle(current, angle, tolerance) and "success" or "running"
end
function GtaAchieveAngleCommand.prototype.onFinish(self)
    clearCharTasksImmediately(self.options.handle)
end
return ____exports
 end,
["gta-sa.src.actor.animations"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
--- Блок, который всегда загружен в игре. Его не нужно загружать перед проигрыванием анимации
____exports.ALWAYS_LOADED_BLOCK = "PED"
--- Анимации GTA SA, которыми показываются анимации актора. Прямых анимаций для части действий в
-- игре нет, поэтому подобраны похожие
____exports.GTA_ANIMATIONS = {
    ["trash-search-start"] = {block = "INT_SHOP", name = "shop_in", duration = 1000},
    ["trash-search"] = {block = "INT_SHOP", name = "shop_loop", duration = 2000},
    ["trash-search-look-1"] = {block = "INT_SHOP", name = "shop_lookA", duration = 2000},
    ["trash-search-look-2"] = {block = "INT_SHOP", name = "shop_lookB", duration = 3000},
    ["trash-search-pocket"] = {block = "INT_SHOP", name = "shop_shelf", duration = 2330},
    ["trash-search-end"] = {block = "INT_SHOP", name = "shop_out", duration = 1330},
    ["beg-sitting"] = {block = "CRACK", name = "crckidle1", duration = 3500},
    ["item-give"] = {block = "KISSING", name = "gift_give", duration = 5330},
    ["item-receive"] = {block = "KISSING", name = "gift_get", duration = 5330},
    pay = {block = "DEALER", name = "shop_pay", duration = 4670},
    ["drink-standing-1"] = {block = "BAR", name = "dnk_stndM_loop", duration = 2330},
    ["drink-standing-2"] = {block = "BAR", name = "dnk_stndF_loop", duration = 2330}
}
return ____exports
 end,
["gta-sa.src.actor.go-to-coords-command"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____actor_2Dcommand = require("core.actor-command.src.index")
local Command = ____actor_2Dcommand.Command
local ____moonloader = require("moonloader.src.index")
local clearCharTasksImmediately = ____moonloader.clearCharTasksImmediately
local getClosestCharNode = ____moonloader.getClosestCharNode
local taskGoToObject = ____moonloader.taskGoToObject
--- Команда проверяет, пришёл ли персонаж, раз в секунду
local GO_TO_COORDS = {name = "go-to-coords", updatePeriod = 1000}
--- Id модели конуса, к которому идёт персонаж
local TARGET_MODEL_ID = 3283
--- Раз в сколько обновлений команда проверяет, не застрял ли персонаж
local STUCK_CHECK_UPDATES = 20
--- Если за STUCK_CHECK_UPDATES обновлений персонаж сдвинулся не больше, чем на столько метров, он застрял
local STUCK_DISTANCE = 7
--- Ведёт игрового персонажа к точке и раз в секунду сообщает его позицию. Игра ведёт персонажа к
-- ближайшему узлу путей пешеходов, и, если узел за стеной, персонаж упирается в неё. Поэтому, если за
-- STUCK_CHECK_UPDATES обновлений персонаж сдвинулся не больше, чем на STUCK_DISTANCE, команда пишет
-- об этом в лог и переносит его на ближайший узел: оттуда игра ведёт его дальше по узлам
____exports.GtaGoToCoordsCommand = __TS__Class()
local GtaGoToCoordsCommand = ____exports.GtaGoToCoordsCommand
GtaGoToCoordsCommand.name = "GtaGoToCoordsCommand"
__TS__ClassExtends(GtaGoToCoordsCommand, Command)
function GtaGoToCoordsCommand.prototype.____constructor(self, actor, options, deps)
    Command.prototype.____constructor(
        self,
        GO_TO_COORDS,
        actor,
        options,
        deps
    )
    self.target = nil
    self.checkpoint = nil
    self.updatesSinceCheckpoint = 0
end
function GtaGoToCoordsCommand.prototype.onStart(self)
    local ____self_deps_0 = self.deps
    local objectFactory = ____self_deps_0.objectFactory
    local target = objectFactory:create({modelId = TARGET_MODEL_ID, position = self.options.coords})
    target:freeze()
    target:setVisibility(false)
    target:setCollisionEnabled(false)
    taskGoToObject(self.options.handle, target.handle, -1, 0.1)
    self.target = target
end
function GtaGoToCoordsCommand.prototype.onUpdate(self)
    local ____self_options_1 = self.options
    local coords = ____self_options_1.coords
    local completeRadius = ____self_options_1.completeRadius
    local ____self_deps_2 = self.deps
    local geometry = ____self_deps_2.geometry
    local position = self.actor:getPosition()
    self:emit(position)
    if geometry:isWithinRadius2d(position, coords, completeRadius) then
        return "success"
    end
    self:checkStuck(position)
    return "running"
end
function GtaGoToCoordsCommand.prototype.checkStuck(self, position)
    if not self.checkpoint then
        self.checkpoint = position
        return
    end
    self.updatesSinceCheckpoint = self.updatesSinceCheckpoint + 1
    if self.updatesSinceCheckpoint < STUCK_CHECK_UPDATES then
        return
    end
    local ____self_deps_3 = self.deps
    local geometry = ____self_deps_3.geometry
    local stuck = geometry:isWithinRadius2d(position, self.checkpoint, STUCK_DISTANCE)
    self.checkpoint = stuck and self:teleportToClosestNode(position) or position
    self.updatesSinceCheckpoint = 0
end
function GtaGoToCoordsCommand.prototype.teleportToClosestNode(self, position)
    local ____self_deps_4 = self.deps
    local geometry = ____self_deps_4.geometry
    local logger = ____self_deps_4.logger
    local x, y, z = getClosestCharNode(position.x, position.y, position.z)
    local node = {x = x, y = y, z = z}
    local from = geometry:formatPoint(position)
    local to = geometry:formatPoint(self.options.coords)
    logger:warn((((("Персонаж застрял на " .. from) .. " по пути к ") .. to) .. ", переносим на узел ") .. geometry:formatPoint(node))
    self.actor:setPosition(node)
    return node
end
function GtaGoToCoordsCommand.prototype.onFinish(self)
    if not self.target then
        return
    end
    self.target:remove()
    clearCharTasksImmediately(self.options.handle)
end
return ____exports
 end,
["gta-sa.src.actor.play-animation-command"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____actor_2Dcommand = require("core.actor-command.src.index")
local Command = ____actor_2Dcommand.Command
local ____moonloader = require("moonloader.src.index")
local clearCharTasks = ____moonloader.clearCharTasks
local clearCharTasksImmediately = ____moonloader.clearCharTasksImmediately
local taskPlayAnim = ____moonloader.taskPlayAnim
--- Команда проверяет, закончилась ли анимация, раз в 100 миллисекунд
local PLAY_ANIMATION = {name = "play-animation", updatePeriod = 100}
--- Скорость перехода в анимацию из текущей позы. 4 — обычное значение для анимаций в игре
local BLEND_SPEED = 4
--- Ждёт, пока менеджер загрузит блок анимации, проигрывает её и завершается, когда проходит время
-- проигрывания. Зацикленную анимацию по завершении плавно останавливает, а прерванную — сразу.
-- Блок нужен команде, пока она не закончилась. Выбрасывает ошибку при создании, если параметры не
-- подходят анимации (см. IAnimationManager.resolve)
____exports.GtaPlayAnimationCommand = __TS__Class()
local GtaPlayAnimationCommand = ____exports.GtaPlayAnimationCommand
GtaPlayAnimationCommand.name = "GtaPlayAnimationCommand"
__TS__ClassExtends(GtaPlayAnimationCommand, Command)
function GtaPlayAnimationCommand.prototype.____constructor(self, actor, options, deps)
    local playback = deps.animations:resolve(options.animation, options.playbackDuration)
    Command.prototype.____constructor(
        self,
        PLAY_ANIMATION,
        actor,
        options,
        deps
    )
    self.playback = playback
    self.playedFor = nil
end
function GtaPlayAnimationCommand.prototype.onStart(self)
    local ____self_deps_0 = self.deps
    local animations = ____self_deps_0.animations
    animations:acquire(self.options.animation):subscribe(
        function() return self:play() end,
        {signal = self.signal}
    )
end
function GtaPlayAnimationCommand.prototype.onUpdate(self, elapsed)
    if self.playedFor == nil then
        return "running"
    end
    self.playedFor = self.playedFor + elapsed
    return self.playedFor >= self.playback.duration and "success" or "running"
end
function GtaPlayAnimationCommand.prototype.onFinish(self, result)
    local ____self_options_1 = self.options
    local handle = ____self_options_1.handle
    if result ~= "success" then
        clearCharTasksImmediately(handle)
    elseif self.playback.loop then
        clearCharTasks(handle)
    end
end
function GtaPlayAnimationCommand.prototype.play(self)
    local ____self_playback_2 = self.playback
    local animation = ____self_playback_2.animation
    local loop = ____self_playback_2.loop
    taskPlayAnim(
        self.options.handle,
        animation.name,
        animation.block,
        BLEND_SPEED,
        loop,
        false,
        false,
        false,
        -1
    )
    self.playedFor = 0
end
return ____exports
 end,
["gta-sa.src.actor.actor"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____events = require("toolkit.events.src.index")
local AbortController = ____events.AbortController
local ____moonloader = require("moonloader.src.index")
local createChar = ____moonloader.createChar
local deleteChar = ____moonloader.deleteChar
local doesCharExist = ____moonloader.doesCharExist
local dontRemoveChar = ____moonloader.dontRemoveChar
local getCharCoordinates = ____moonloader.getCharCoordinates
local getCharHeading = ____moonloader.getCharHeading
local loadAllModelsNow = ____moonloader.loadAllModelsNow
local markModelAsNoLongerNeeded = ____moonloader.markModelAsNoLongerNeeded
local requestModel = ____moonloader.requestModel
local setCharCoordinates = ____moonloader.setCharCoordinates
local setCharHeading = ____moonloader.setCharHeading
local ____achieve_2Dangle_2Dcommand = require("gta-sa.src.actor.achieve-angle-command")
local GtaAchieveAngleCommand = ____achieve_2Dangle_2Dcommand.GtaAchieveAngleCommand
local ____go_2Dto_2Dcoords_2Dcommand = require("gta-sa.src.actor.go-to-coords-command")
local GtaGoToCoordsCommand = ____go_2Dto_2Dcoords_2Dcommand.GtaGoToCoordsCommand
local ____play_2Danimation_2Dcommand = require("gta-sa.src.actor.play-animation-command")
local GtaPlayAnimationCommand = ____play_2Danimation_2Dcommand.GtaPlayAnimationCommand
____exports.GtaActor = __TS__Class()
local GtaActor = ____exports.GtaActor
GtaActor.name = "GtaActor"
function GtaActor.prototype.____constructor(self, options, deps)
    requestModel(options.modelId)
    loadAllModelsNow()
    local ____options_position_0 = options.position
    local x = ____options_position_0.x
    local y = ____options_position_0.y
    local z = ____options_position_0.z
    self.handle = createChar(
        4,
        options.modelId,
        x,
        y,
        z
    )
    setCharHeading(
        self.handle,
        deps.geometry:normalizeAngle(options.angle)
    )
    dontRemoveChar(self.handle)
    markModelAsNoLongerNeeded(options.modelId)
    self.deps = deps
    self.despawnController = __TS__New(AbortController)
end
function GtaActor.prototype.getPosition(self)
    local x, y, z = getCharCoordinates(self.handle)
    return {x = x, y = y, z = z}
end
function GtaActor.prototype.getAngle(self)
    local ____self_deps_1 = self.deps
    local geometry = ____self_deps_1.geometry
    return geometry:normalizeAngle(getCharHeading(self.handle))
end
function GtaActor.prototype.setPosition(self, position)
    setCharCoordinates(self.handle, position.x, position.y, position.z)
end
function GtaActor.prototype.setAngle(self, angle)
    local ____self_deps_2 = self.deps
    local geometry = ____self_deps_2.geometry
    setCharHeading(
        self.handle,
        geometry:normalizeAngle(angle)
    )
end
function GtaActor.prototype.achieveAngle(self, angle, tolerance)
    local ____self_deps_3 = self.deps
    local geometry = ____self_deps_3.geometry
    local timer = ____self_deps_3.timer
    return __TS__New(GtaAchieveAngleCommand, self, {handle = self.handle, angle = angle, tolerance = tolerance}, {geometry = geometry, timer = timer})
end
function GtaActor.prototype.goToCoords(self, coords, completeRadius)
    local ____self_deps_4 = self.deps
    local geometry = ____self_deps_4.geometry
    local logger = ____self_deps_4.logger
    local objectFactory = ____self_deps_4.objectFactory
    local timer = ____self_deps_4.timer
    return __TS__New(GtaGoToCoordsCommand, self, {handle = self.handle, coords = coords, completeRadius = completeRadius}, {geometry = geometry, logger = logger, objectFactory = objectFactory, timer = timer})
end
function GtaActor.prototype.playAnimation(self, animation, playbackDuration)
    local ____self_deps_5 = self.deps
    local animations = ____self_deps_5.animations
    local timer = ____self_deps_5.timer
    return __TS__New(GtaPlayAnimationCommand, self, {handle = self.handle, animation = animation, playbackDuration = playbackDuration}, {animations = animations, timer = timer})
end
function GtaActor.prototype.despawn(self)
    self.despawnController:abort(__TS__New(Error, "Актор деспавнен"))
    if doesCharExist(self.handle) then
        deleteChar(self.handle)
    end
end
__TS__SetDescriptor(
    GtaActor.prototype,
    "signal",
    {get = function(self)
        return self.despawnController.signal
    end},
    true
)
return ____exports
 end,
["gta-sa.src.actor.animation-loader"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____events = require("toolkit.events.src.index")
local AbortController = ____events.AbortController
local Observable = ____events.Observable
local ____moonloader = require("moonloader.src.index")
local hasAnimationLoaded = ____moonloader.hasAnimationLoaded
local removeAnimation = ____moonloader.removeAnimation
local requestAnimation = ____moonloader.requestAnimation
local ____animations = require("gta-sa.src.actor.animations")
local ALWAYS_LOADED_BLOCK = ____animations.ALWAYS_LOADED_BLOCK
--- Как часто загрузчик проверяет, загрузился ли блок, в миллисекундах
local CHECK_PERIOD = 100
--- Загружает блоки анимаций GTA SA. Анимации одного блока загружаются одной загрузкой. Блок PED
-- всегда загружен, поэтому его загрузчик не загружает и не выгружает
____exports.GtaAnimationLoader = __TS__Class()
local GtaAnimationLoader = ____exports.GtaAnimationLoader
GtaAnimationLoader.name = "GtaAnimationLoader"
function GtaAnimationLoader.prototype.____constructor(self, deps)
    self.deps = deps
end
function GtaAnimationLoader.prototype.key(self, animation)
    return animation.block
end
function GtaAnimationLoader.prototype.load(self, animation)
    local ____animation_0 = animation
    local block = ____animation_0.block
    local ____self_deps_1 = self.deps
    local timer = ____self_deps_1.timer
    return __TS__New(
        Observable,
        function(subscriber)
            if block == ALWAYS_LOADED_BLOCK then
                subscriber:next()
                return
            end
            requestAnimation(block)
            subscriber:addTeardown(function() return removeAnimation(block) end)
            if hasAnimationLoaded(block) then
                subscriber:next()
                return
            end
            local checking = __TS__New(AbortController)
            subscriber:addTeardown(function() return checking:abort() end)
            timer:interval(CHECK_PERIOD):subscribe(
                function()
                    if hasAnimationLoaded(block) then
                        checking:abort()
                        subscriber:next()
                    end
                end,
                {signal = checking.signal}
            )
        end
    )
end
return ____exports
 end,
["gta-sa.src.actor.factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____actor = require("gta-sa.src.actor.actor")
local GtaActor = ____actor.GtaActor
____exports.GtaActorFactory = __TS__Class()
local GtaActorFactory = ____exports.GtaActorFactory
GtaActorFactory.name = "GtaActorFactory"
function GtaActorFactory.prototype.____constructor(self, deps)
    self.deps = deps
end
function GtaActorFactory.prototype.create(self, options)
    return __TS__New(GtaActor, options, self.deps)
end
return ____exports
 end,
["gta-sa.src.actor.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____actor = require("gta-sa.src.actor.actor")
    ____exports.GtaActor = ____actor.GtaActor
end
do
    local ____animation_2Dloader = require("gta-sa.src.actor.animation-loader")
    ____exports.GtaAnimationLoader = ____animation_2Dloader.GtaAnimationLoader
end
do
    local ____animations = require("gta-sa.src.actor.animations")
    ____exports.ALWAYS_LOADED_BLOCK = ____animations.ALWAYS_LOADED_BLOCK
    ____exports.GTA_ANIMATIONS = ____animations.GTA_ANIMATIONS
end
do
    local ____factory = require("gta-sa.src.actor.factory")
    ____exports.GtaActorFactory = ____factory.GtaActorFactory
end
return ____exports
 end,
["gta-sa.src.logger"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
local ____moonloader = require("moonloader.src.index")
local ____print = ____moonloader.print
--- Пишет лог в moonloader.log через print, помечая каждое сообщение уровнем
____exports.GtaLogger = __TS__Class()
local GtaLogger = ____exports.GtaLogger
GtaLogger.name = "GtaLogger"
function GtaLogger.prototype.____constructor(self)
end
function GtaLogger.prototype.info(self, message)
    ____print("[info] " .. message)
end
function GtaLogger.prototype.warn(self, message)
    ____print("[warn] " .. message)
end
function GtaLogger.prototype.error(self, message)
    ____print("[error] " .. message)
end
return ____exports
 end,
["gta-sa.src.time"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____moonloader = require("moonloader.src.index")
local getTimeOfDay = ____moonloader.getTimeOfDay
--- Время GTA. Часы и минуты берутся из игры, а дни игра не считает, поэтому их считает время: каждый
-- тик и при каждом чтении сверяется с игрой и, если час стал меньше прошлого, значит наступила
-- полночь. Считается, что за один тик игровое время не уходит вперёд на сутки
____exports.GtaTime = __TS__Class()
local GtaTime = ____exports.GtaTime
GtaTime.name = "GtaTime"
function GtaTime.prototype.____constructor(self, deps)
    local hours, minutes = getTimeOfDay()
    self.state = {day = 1, hours = hours, minutes = minutes}
    deps.ticks:subscribe(function() return self:sync() end)
end
function GtaTime.prototype.getState(self)
    self:sync()
    local ____self_state_0 = self.state
    local day = ____self_state_0.day
    local hours = ____self_state_0.hours
    local minutes = ____self_state_0.minutes
    return {day = day, hours = hours, minutes = minutes}
end
function GtaTime.prototype.sync(self)
    local hours, minutes = getTimeOfDay()
    local day = hours < self.state.hours and self.state.day + 1 or self.state.day
    self.state = {day = day, hours = hours, minutes = minutes}
end
__TS__SetDescriptor(
    GtaTime.prototype,
    "day",
    {get = function(self)
        return self:getState().day
    end},
    true
)
__TS__SetDescriptor(
    GtaTime.prototype,
    "hours",
    {get = function(self)
        return self:getState().hours
    end},
    true
)
__TS__SetDescriptor(
    GtaTime.prototype,
    "minutes",
    {get = function(self)
        return self:getState().minutes
    end},
    true
)
return ____exports
 end,
["gta-sa.src.game"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____animation_2Dmanager = require("core.animation-manager.src.index")
local AnimationManager = ____animation_2Dmanager.AnimationManager
local ____events = require("toolkit.events.src.index")
local AbortController = ____events.AbortController
local EventTarget = ____events.EventTarget
local ____geometry = require("toolkit.geometry.src.index")
local Geometry = ____geometry.Geometry
local ____moonloader = require("moonloader.src.index")
local addEventHandler = ____moonloader.addEventHandler
local thisScript = ____moonloader.thisScript
local ____timings = require("toolkit.timings.src.index")
local Timer = ____timings.Timer
local ____actor = require("gta-sa.src.actor.index")
local GTA_ANIMATIONS = ____actor.GTA_ANIMATIONS
local GtaActorFactory = ____actor.GtaActorFactory
local GtaAnimationLoader = ____actor.GtaAnimationLoader
local ____logger = require("gta-sa.src.logger")
local GtaLogger = ____logger.GtaLogger
local ____object = require("gta-sa.src.object.index")
local GtaObjectFactory = ____object.GtaObjectFactory
local ____time = require("gta-sa.src.time")
local GtaTime = ____time.GtaTime
--- Как часто игра сообщает о тике мира, в миллисекундах
local TICK_PERIOD = 250
--- Игра GTA SA. Тики мира идут по таймеру раз в TICK_PERIOD миллисекунд, поэтому, пока игра на паузе
-- или ещё не загружена, тиков нет: таймеры в это время не срабатывают
____exports.GtaGame = __TS__Class()
local GtaGame = ____exports.GtaGame
GtaGame.name = "GtaGame"
function GtaGame.prototype.____constructor(self, deps)
    if deps == nil then
        deps = {}
    end
    local logger = deps.logger or __TS__New(GtaLogger)
    local timer = __TS__New(Timer)
    self.terminateController = __TS__New(AbortController)
    addEventHandler(
        "onScriptTerminate",
        function(script)
            if script == thisScript() then
                self.terminateController:abort(__TS__New(Error, "Скрипт выгружен"))
            end
        end
    )
    local ____self_terminateController_0 = self.terminateController
    local signal = ____self_terminateController_0.signal
    local tickEvents = __TS__New(EventTarget)
    timer:interval(TICK_PERIOD):subscribe(
        function() return tickEvents:dispatchEvent("tick") end,
        {signal = signal}
    )
    self.ticks = tickEvents:when("tick")
    self.time = __TS__New(GtaTime, {ticks = self.ticks})
    self.geometry = __TS__New(Geometry)
    self.objectFactory = __TS__New(GtaObjectFactory)
    self.actorFactory = __TS__New(
        GtaActorFactory,
        {
            animations = __TS__New(
                AnimationManager,
                {animations = GTA_ANIMATIONS},
                {loader = __TS__New(GtaAnimationLoader, {timer = timer})}
            ),
            geometry = self.geometry,
            logger = logger,
            objectFactory = self.objectFactory,
            timer = timer
        }
    )
end
__TS__SetDescriptor(
    GtaGame.prototype,
    "signal",
    {get = function(self)
        return self.terminateController.signal
    end},
    true
)
return ____exports
 end,
["gta-sa.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____export = require("gta-sa.src.actor.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("gta-sa.src.game")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____logger = require("gta-sa.src.logger")
    ____exports.GtaLogger = ____logger.GtaLogger
end
do
    local ____export = require("gta-sa.src.object.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
return ____exports
 end,
["toolkit.repository.src.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["toolkit.repository.src.matches"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__ObjectEntries = ____lualib.__TS__ObjectEntries
local __TS__ArrayFind = ____lualib.__TS__ArrayFind
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local __TS__ArrayEvery = ____lualib.__TS__ArrayEvery
local __TS__ObjectKeys = ____lualib.__TS__ObjectKeys
local ____exports = {}
local keys
function keys(object)
    return __TS__ObjectKeys(object)
end
--- Реализации операторов. Каждая типизирована по своему типу поля и операнду
local operators = {eq = function(value, operand) return value == operand end}
local function getOperator(name)
    local operator = __TS__ArrayFind(
        __TS__ObjectEntries(operators),
        function(____, ____bindingPattern0)
            local operatorName
            operatorName = ____bindingPattern0[1]
            return operatorName == name
        end
    )
    if not operator then
        error(
            __TS__New(Error, "Unsupported operator: " .. name),
            0
        )
    end
    return operator[2]
end
local function matchesCondition(value, condition)
    return __TS__ArrayEvery(
        __TS__ObjectEntries(condition),
        function(____, ____bindingPattern0)
            local operand
            local name
            name = ____bindingPattern0[1]
            operand = ____bindingPattern0[2]
            return getOperator(name)(value, operand)
        end
    )
end
--- Проверяет, что запись подходит под все критерии
function ____exports.matches(entity, criteria)
    return __TS__ArrayEvery(
        keys(criteria),
        function(____, field)
            local condition = criteria[field]
            return condition == nil or matchesCondition(entity[field], condition)
        end
    )
end
return ____exports
 end,
["toolkit.repository.src.in-memory-repository"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__Promise = ____lualib.__TS__Promise
local __TS__ArrayFind = ____lualib.__TS__ArrayFind
local __TS__ArrayFilter = ____lualib.__TS__ArrayFilter
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____matches = require("toolkit.repository.src.matches")
local matches = ____matches.matches
____exports.InMemoryRepository = __TS__Class()
local InMemoryRepository = ____exports.InMemoryRepository
InMemoryRepository.name = "InMemoryRepository"
function InMemoryRepository.prototype.____constructor(self, entities)
    self.entities = entities
end
function InMemoryRepository.prototype.getAll(self)
    return __TS__Promise.resolve({unpack(self.entities)})
end
function InMemoryRepository.prototype.getById(self, id)
    return __TS__Promise.resolve(__TS__ArrayFind(
        self.entities,
        function(____, entity) return entity.id == id end
    ))
end
function InMemoryRepository.prototype.find(self, criteria)
    return __TS__New(
        __TS__Promise,
        function(____, resolve)
            resolve(
                nil,
                __TS__ArrayFilter(
                    self.entities,
                    function(____, entity) return matches(entity, criteria) end
                )
            )
        end
    )
end
return ____exports
 end,
["toolkit.repository.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____in_2Dmemory_2Drepository = require("toolkit.repository.src.in-memory-repository")
    ____exports.InMemoryRepository = ____in_2Dmemory_2Drepository.InMemoryRepository
end
return ____exports
 end,
["core.inventory.src.item"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.Item = ____exports.Item or ({})
____exports.Item.Money = "money"
____exports.Item.Bottles = "bottles"
____exports.Item.Booze = "booze"
return ____exports
 end,
["core.inventory.src.inventory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectValues = ____lualib.__TS__ObjectValues
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__NumberIsFinite = ____lualib.__TS__NumberIsFinite
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local ____exports = {}
local assertCount
local ____item = require("core.inventory.src.item")
local Item = ____item.Item
function assertCount(count)
    if not __TS__NumberIsFinite(count) or count < 0 then
        error(
            __TS__New(
                RangeError,
                "Количество должно быть конечным неотрицательным числом, получено " .. tostring(count)
            ),
            0
        )
    end
end
--- Хранит количество каждого предмета. Количество — конечное неотрицательное число, в том числе
-- дробное. Предметы с нулевым количеством не хранятся
____exports.Inventory = __TS__Class()
local Inventory = ____exports.Inventory
Inventory.name = "Inventory"
function Inventory.prototype.____constructor(self, counts)
    if counts == nil then
        counts = {}
    end
    self.counts = __TS__New(Map)
    __TS__ArrayForEach(
        __TS__ObjectValues(Item),
        function(____, item)
            local count = counts[item]
            if count ~= nil then
                self:set(item, count)
            end
        end
    )
end
function Inventory.prototype.get(self, item)
    return self.counts:get(item) or 0
end
function Inventory.prototype.getAll(self)
    local counts = {}
    self.counts:forEach(function(____, count, item)
        counts[item] = count
    end)
    return counts
end
function Inventory.prototype.clone(self)
    return __TS__New(
        ____exports.Inventory,
        self:getAll()
    )
end
function Inventory.prototype.set(self, item, count)
    assertCount(count)
    self:write(item, count)
end
function Inventory.prototype.has(self, item)
    return self:get(item) > 0
end
function Inventory.prototype.add(self, item, count)
    assertCount(count)
    self:write(
        item,
        self:get(item) + count
    )
end
function Inventory.prototype.remove(self, item, count)
    assertCount(count)
    local current = self:get(item)
    if current < count then
        return false
    end
    self:write(item, current - count)
    return true
end
function Inventory.prototype.write(self, item, count)
    if count == 0 then
        self.counts:delete(item)
    else
        self.counts:set(item, count)
    end
end
return ____exports
 end,
["core.inventory.src.factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____inventory = require("core.inventory.src.inventory")
local Inventory = ____inventory.Inventory
____exports.InventoryFactory = __TS__Class()
local InventoryFactory = ____exports.InventoryFactory
InventoryFactory.name = "InventoryFactory"
function InventoryFactory.prototype.____constructor(self)
end
function InventoryFactory.prototype.create(self, counts)
    if counts == nil then
        counts = {}
    end
    return __TS__New(Inventory, counts)
end
return ____exports
 end,
["core.inventory.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____factory = require("core.inventory.src.factory")
    ____exports.InventoryFactory = ____factory.InventoryFactory
end
do
    local ____inventory = require("core.inventory.src.inventory")
    ____exports.Inventory = ____inventory.Inventory
end
do
    local ____item = require("core.inventory.src.item")
    ____exports.Item = ____item.Item
end
return ____exports
 end,
["core.psyche.src.deed"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
--- Поступки, на которые реагирует психика
____exports.Deed = ____exports.Deed or ({})
____exports.Deed.BottleFound = "bottle-found"
____exports.Deed.Begging = "begging"
return ____exports
 end,
["core.psyche.src.feeling"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
--- Чувства
____exports.Feeling = ____exports.Feeling or ({})
____exports.Feeling.Shame = "shame"
return ____exports
 end,
["core.psyche.src.trait"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
--- Черты характера
____exports.Trait = ____exports.Trait or ({})
____exports.Trait.Conscientiousness = "conscientiousness"
____exports.Trait.Luck = "luck"
____exports.Trait.Optimism = "optimism"
return ____exports
 end,
["core.psyche.src.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.psyche.src.psyche"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectValues = ____lualib.__TS__ObjectValues
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local __TS__ArrayMap = ____lualib.__TS__ArrayMap
local __TS__ArrayReduce = ____lualib.__TS__ArrayReduce
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__New = ____lualib.__TS__New
local __TS__NumberIsFinite = ____lualib.__TS__NumberIsFinite
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local ____exports = {}
local ____feeling = require("core.psyche.src.feeling")
local Feeling = ____feeling.Feeling
local ____trait = require("core.psyche.src.trait")
local Trait = ____trait.Trait
--- Психика хранит черты характера и чувства. На поступок психика отвечает так: каждая черта
-- возвращает свой вклад в чувства, психика складывает вклады и держит чувства в пределах от
-- Psyche.MIN_FEELING до Psyche.MAX_FEELING. Психика, собранная из состояния, реагирует так же, как исходная
____exports.Psyche = __TS__Class()
local Psyche = ____exports.Psyche
Psyche.name = "Psyche"
function Psyche.prototype.____constructor(self, state, deps)
    local ____deps_0 = deps
    local traitFactories = ____deps_0.traitFactories
    self.deps = deps
    __TS__ArrayForEach(
        __TS__ObjectValues(Feeling),
        function(____, feeling) return self:assertFeeling(feeling, state.feelings[feeling]) end
    )
    self.traitValues = state.traits
    self.feelings = state.feelings
    self.luck = traitFactories[Trait.Luck]:create(state.traits[Trait.Luck])
    self.optimism = traitFactories[Trait.Optimism]:create(state.traits[Trait.Optimism])
    self.traits = {
        traitFactories[Trait.Conscientiousness]:create(state.traits[Trait.Conscientiousness]),
        self.luck,
        self.optimism
    }
end
function Psyche.prototype.getState(self)
    return {traits = self.traitValues, feelings = self.feelings}
end
function Psyche.prototype.react(self, deed)
    local contributions = __TS__ArrayMap(
        self.traits,
        function(____, trait) return trait:react(deed) end
    )
    self.feelings = __TS__ArrayReduce(
        __TS__ObjectValues(Feeling),
        function(____, feelings, feeling)
            local change = __TS__ArrayReduce(
                contributions,
                function(____, sum, contribution) return sum + self:getChange(contribution, feeling) end,
                0
            )
            return __TS__ObjectAssign(
                {},
                feelings,
                {[feeling] = self:clampFeeling(feelings[feeling] + change)}
            )
        end,
        self.feelings
    )
end
function Psyche.prototype.clone(self)
    return __TS__New(
        ____exports.Psyche,
        self:getState(),
        self.deps
    )
end
function Psyche.prototype.adjustChance(self, chance)
    return self.luck:adjustChance(chance)
end
function Psyche.prototype.expectAttempts(self, chance)
    return self.optimism:expectAttempts(chance)
end
function Psyche.prototype.getChange(self, contribution, feeling)
    local change = contribution[feeling] or 0
    if not __TS__NumberIsFinite(change) then
        error(
            __TS__New(
                RangeError,
                (("Вклад в чувство " .. feeling) .. " должен быть конечным числом: ") .. tostring(change)
            ),
            0
        )
    end
    return change
end
function Psyche.prototype.clampFeeling(self, value)
    return math.min(
        ____exports.Psyche.MAX_FEELING,
        math.max(____exports.Psyche.MIN_FEELING, value)
    )
end
function Psyche.prototype.assertFeeling(self, feeling, value)
    if not __TS__NumberIsFinite(value) or value < ____exports.Psyche.MIN_FEELING or value > ____exports.Psyche.MAX_FEELING then
        error(
            __TS__New(
                RangeError,
                (((((("Чувство " .. feeling) .. " должно быть числом от ") .. tostring(____exports.Psyche.MIN_FEELING)) .. " до ") .. tostring(____exports.Psyche.MAX_FEELING)) .. ", получено ") .. tostring(value)
            ),
            0
        )
    end
end
Psyche.MIN_FEELING = 0
Psyche.MAX_FEELING = 100
return ____exports
 end,
["core.psyche.src.constants"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
--- На сколько растёт стыд за одну попытку клянчить при средней совестливости
____exports.BEGGING_SHAME = 0.1
--- На сколько падает стыд за одну найденную бутылку при средней совестливости
____exports.BOTTLE_FOUND_SHAME_RELIEF = 2
return ____exports
 end,
["core.psyche.src.traits.conscientiousness"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__NumberIsFinite = ____lualib.__TS__NumberIsFinite
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____constants = require("core.psyche.src.constants")
local BEGGING_SHAME = ____constants.BEGGING_SHAME
local BOTTLE_FOUND_SHAME_RELIEF = ____constants.BOTTLE_FOUND_SHAME_RELIEF
local ____deed = require("core.psyche.src.deed")
local Deed = ____deed.Deed
local ____feeling = require("core.psyche.src.feeling")
local Feeling = ____feeling.Feeling
--- Совестливость. Чем она выше, тем быстрее растёт стыд, когда NPC клянчит, и тем медленнее падает,
-- когда NPC сам находит бутылки. При средней совестливости стыд меняется на BEGGING_SHAME и
-- BOTTLE_FOUND_SHAME_RELIEF, а на краях — вдвое медленнее или в полтора раза быстрее
____exports.Conscientiousness = __TS__Class()
local Conscientiousness = ____exports.Conscientiousness
Conscientiousness.name = "Conscientiousness"
function Conscientiousness.prototype.____constructor(self, value)
    self:assertValue(value)
    self.value = value
end
function Conscientiousness.prototype.react(self, deed)
    repeat
        local ____switch4 = deed
        local ____cond4 = ____switch4 == Deed.Begging
        if ____cond4 then
            return {[Feeling.Shame] = BEGGING_SHAME * (0.5 + self:getShare())}
        end
        ____cond4 = ____cond4 or ____switch4 == Deed.BottleFound
        if ____cond4 then
            return {[Feeling.Shame] = -BOTTLE_FOUND_SHAME_RELIEF * (1.5 - self:getShare())}
        end
    until true
end
function Conscientiousness.prototype.getShare(self)
    return (self.value - ____exports.Conscientiousness.MIN) / (____exports.Conscientiousness.MAX - ____exports.Conscientiousness.MIN)
end
function Conscientiousness.prototype.assertValue(self, value)
    if not __TS__NumberIsFinite(value) or value < ____exports.Conscientiousness.MIN or value > ____exports.Conscientiousness.MAX then
        error(
            __TS__New(
                RangeError,
                (((("Совестливость должна быть числом от " .. tostring(____exports.Conscientiousness.MIN)) .. " до ") .. tostring(____exports.Conscientiousness.MAX)) .. ", получено ") .. tostring(value)
            ),
            0
        )
    end
end
Conscientiousness.MIN = 0
Conscientiousness.MAX = 100
____exports.ConscientiousnessFactory = __TS__Class()
local ConscientiousnessFactory = ____exports.ConscientiousnessFactory
ConscientiousnessFactory.name = "ConscientiousnessFactory"
function ConscientiousnessFactory.prototype.____constructor(self)
end
function ConscientiousnessFactory.prototype.create(self, value)
    return __TS__New(____exports.Conscientiousness, value)
end
return ____exports
 end,
["core.psyche.src.traits.luck"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__NumberIsFinite = ____lualib.__TS__NumberIsFinite
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local ____exports = {}
--- Удачливость. Меняет шанс, с которым персонажу везёт в игре: при средней удачливости шанс как есть,
-- а на краях соотношение удач и неудач, шанс / (1 − шанс), в Luck.CHANCE_SPREAD раз ниже или выше.
-- 
-- Умножается соотношение, а не сам шанс, чтобы большой шанс не выходил за 1: 0.8 × 1.5 = 1.2, а с
-- соотношением 0.8 становится ~0.86. На малых шансах соотношение почти равно шансу: 1/40 становится
-- ~1/27. Множитель экспоненциальный, потому что шанс меняется «в разах»: так каждый шаг удачливости
-- меняет его в одинаковое число раз, а нижний край душит шанс не сильнее, чем верхний поднимает
____exports.Luck = __TS__Class()
local Luck = ____exports.Luck
Luck.name = "Luck"
function Luck.prototype.____constructor(self, value)
    self:assertValue(value)
    self.value = value
end
function Luck.prototype.react(self)
    return {}
end
function Luck.prototype.adjustChance(self, chance)
    if chance == 1 then
        return 1
    end
    local odds = chance / (1 - chance) * ____exports.Luck.CHANCE_SPREAD ^ (self:getShare() * 2 - 1)
    return odds / (1 + odds)
end
function Luck.prototype.getShare(self)
    return (self.value - ____exports.Luck.MIN) / (____exports.Luck.MAX - ____exports.Luck.MIN)
end
function Luck.prototype.assertValue(self, value)
    if not __TS__NumberIsFinite(value) or value < ____exports.Luck.MIN or value > ____exports.Luck.MAX then
        error(
            __TS__New(
                RangeError,
                (((("Удачливость должна быть числом от " .. tostring(____exports.Luck.MIN)) .. " до ") .. tostring(____exports.Luck.MAX)) .. ", получено ") .. tostring(value)
            ),
            0
        )
    end
end
Luck.MIN = 0
Luck.MAX = 100
Luck.CHANCE_SPREAD = 1.5
____exports.LuckFactory = __TS__Class()
local LuckFactory = ____exports.LuckFactory
LuckFactory.name = "LuckFactory"
function LuckFactory.prototype.____constructor(self)
end
function LuckFactory.prototype.create(self, value)
    return __TS__New(____exports.Luck, value)
end
return ____exports
 end,
["core.psyche.src.traits.optimism"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local __TS__NumberIsFinite = ____lualib.__TS__NumberIsFinite
local ____exports = {}
--- Оптимизм. Решает, сколько попыток персонаж ожидает до удачи, когда планирует. Реалист при
-- среднем оптимизме ожидает 1 / шанс попыток, оптимист — в Optimism.ATTEMPTS_SPREAD раз меньше,
-- пессимист — в Optimism.ATTEMPTS_SPREAD раз больше. Например, при шансе 1/40 — ~27, 40 или 60.
-- Множитель экспоненциальный, как у удачливости: каждый шаг оптимизма меняет ожидание в одинаковое
-- число раз. Оптимизм не меняет сам шанс, а только то, как персонаж его оценивает
____exports.Optimism = __TS__Class()
local Optimism = ____exports.Optimism
Optimism.name = "Optimism"
function Optimism.prototype.____constructor(self, value)
    self:assertValue(value)
    self.value = value
end
function Optimism.prototype.react(self)
    return {}
end
function Optimism.prototype.expectAttempts(self, chance)
    if not (chance > 0 and chance <= 1) then
        error(
            __TS__New(
                RangeError,
                "Шанс должен быть числом больше 0 и не больше 1, получено " .. tostring(chance)
            ),
            0
        )
    end
    return math.floor(1 / chance * ____exports.Optimism.ATTEMPTS_SPREAD ^ (1 - self:getShare() * 2) + 0.5)
end
function Optimism.prototype.getShare(self)
    return (self.value - ____exports.Optimism.MIN) / (____exports.Optimism.MAX - ____exports.Optimism.MIN)
end
function Optimism.prototype.assertValue(self, value)
    if not __TS__NumberIsFinite(value) or value < ____exports.Optimism.MIN or value > ____exports.Optimism.MAX then
        error(
            __TS__New(
                RangeError,
                (((("Оптимизм должен быть числом от " .. tostring(____exports.Optimism.MIN)) .. " до ") .. tostring(____exports.Optimism.MAX)) .. ", получено ") .. tostring(value)
            ),
            0
        )
    end
end
Optimism.MIN = 0
Optimism.MAX = 100
Optimism.ATTEMPTS_SPREAD = 1.5
____exports.OptimismFactory = __TS__Class()
local OptimismFactory = ____exports.OptimismFactory
OptimismFactory.name = "OptimismFactory"
function OptimismFactory.prototype.____constructor(self)
end
function OptimismFactory.prototype.create(self, value)
    return __TS__New(____exports.Optimism, value)
end
return ____exports
 end,
["core.psyche.src.traits.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____conscientiousness = require("core.psyche.src.traits.conscientiousness")
    ____exports.Conscientiousness = ____conscientiousness.Conscientiousness
    ____exports.ConscientiousnessFactory = ____conscientiousness.ConscientiousnessFactory
end
do
    local ____luck = require("core.psyche.src.traits.luck")
    ____exports.Luck = ____luck.Luck
    ____exports.LuckFactory = ____luck.LuckFactory
end
do
    local ____optimism = require("core.psyche.src.traits.optimism")
    ____exports.Optimism = ____optimism.Optimism
    ____exports.OptimismFactory = ____optimism.OptimismFactory
end
return ____exports
 end,
["core.psyche.src.factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____psyche = require("core.psyche.src.psyche")
local Psyche = ____psyche.Psyche
local ____trait = require("core.psyche.src.trait")
local Trait = ____trait.Trait
local ____traits = require("core.psyche.src.traits.index")
local ConscientiousnessFactory = ____traits.ConscientiousnessFactory
local LuckFactory = ____traits.LuckFactory
local OptimismFactory = ____traits.OptimismFactory
____exports.PsycheFactory = __TS__Class()
local PsycheFactory = ____exports.PsycheFactory
PsycheFactory.name = "PsycheFactory"
function PsycheFactory.prototype.____constructor(self, deps)
    if deps == nil then
        deps = {}
    end
    local ____deps_0 = deps
    local traitFactories = ____deps_0.traitFactories
    if traitFactories == nil then
        traitFactories = {}
    end
    self.deps = {traitFactories = {
        [Trait.Conscientiousness] = traitFactories[Trait.Conscientiousness] or __TS__New(ConscientiousnessFactory),
        [Trait.Luck] = traitFactories[Trait.Luck] or __TS__New(LuckFactory),
        [Trait.Optimism] = traitFactories[Trait.Optimism] or __TS__New(OptimismFactory)
    }}
end
function PsycheFactory.prototype.create(self, state)
    return __TS__New(Psyche, state, self.deps)
end
return ____exports
 end,
["core.psyche.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____deed = require("core.psyche.src.deed")
    ____exports.Deed = ____deed.Deed
end
do
    local ____factory = require("core.psyche.src.factory")
    ____exports.PsycheFactory = ____factory.PsycheFactory
end
do
    local ____feeling = require("core.psyche.src.feeling")
    ____exports.Feeling = ____feeling.Feeling
end
do
    local ____psyche = require("core.psyche.src.psyche")
    ____exports.Psyche = ____psyche.Psyche
end
do
    local ____trait = require("core.psyche.src.trait")
    ____exports.Trait = ____trait.Trait
end
return ____exports
 end,
["core.npc.src.context"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.npc.src.kind"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
--- Типы NPC. От типа зависит, какую корневую задачу планирует HTN-агент NPC
____exports.NpcKind = ____exports.NpcKind or ({})
____exports.NpcKind.Homeless = "homeless"
return ____exports
 end,
["core.npc.src.data"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["toolkit.htn.src.task"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
--- Проверяет, является ли задача примитивной
function ____exports.isPrimitive(task)
    return task.canExecute ~= nil
end
return ____exports
 end,
["toolkit.htn.src.executor"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
____exports.Executor = __TS__Class()
local Executor = ____exports.Executor
Executor.name = "Executor"
function Executor.prototype.____constructor(self, tasks)
    if not #tasks then
        error(
            __TS__New(Error, "Tasks list can't be empty"),
            0
        )
    end
    self.tasks = tasks
    self.currentTaskIndex = 0
    self.status = "idle"
    self.taskStarted = false
end
function Executor.prototype.update(self, state, context)
    if not self:canTouchTask() then
        error(
            __TS__New(Error, "Can't update, because execution is already " .. self.status),
            0
        )
    end
    self.status = self.taskStarted and self.currentTask:update(state, context) or self:start(state, context)
    if self.status == "failed" then
        return self.status
    end
    if self.status == "success" then
        if not self.nextTask then
            return self.status
        end
        self.status = "running"
        self.taskStarted = false
        self.currentTaskIndex = self.currentTaskIndex + 1
    end
    return self.status
end
function Executor.prototype.stop(self, context)
    if not self:canTouchTask() then
        error(
            __TS__New(Error, "Can't stop, because execution is already " .. self.status),
            0
        )
    end
    self.status = "stopped"
    if self.taskStarted then
        self.currentTask:stop(context)
    end
end
function Executor.prototype.start(self, state, context)
    if not self.currentTask:canExecute(state) then
        return "failed"
    end
    local result = self.currentTask:start(state, context)
    self.taskStarted = true
    return result
end
function Executor.prototype.canTouchTask(self)
    return not __TS__ArrayIncludes({"failed", "success", "stopped"}, self.status)
end
__TS__SetDescriptor(
    Executor.prototype,
    "currentTask",
    {get = function(self)
        local task = self.tasks[self.currentTaskIndex + 1]
        if not task then
            local message = ((("Current task' index (" .. tostring(self.currentTaskIndex)) .. ") must be in range of tasks length (") .. tostring(#self.tasks)) .. ")"
            error(
                __TS__New(RangeError, message),
                0
            )
        end
        return task
    end},
    true
)
__TS__SetDescriptor(
    Executor.prototype,
    "nextTask",
    {get = function(self)
        local index = self.currentTaskIndex + 1
        return self.tasks[index + 1] or nil
    end},
    true
)
return ____exports
 end,
["toolkit.htn.src.planner"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ArraySlice = ____lualib.__TS__ArraySlice
local __TS__ArrayConcat = ____lualib.__TS__ArrayConcat
local ____exports = {}
local ____task = require("toolkit.htn.src.task")
local isPrimitive = ____task.isPrimitive
____exports.Planner = __TS__Class()
local Planner = ____exports.Planner
Planner.name = "Planner"
function Planner.prototype.____constructor(self)
end
function Planner.prototype.plan(self, root, state)
    return self:decompose({root}, state)
end
function Planner.prototype.decompose(self, tasks, state)
    local ____tasks_0 = tasks
    local head = ____tasks_0[1]
    local tail = __TS__ArraySlice(____tasks_0, 1)
    if not head then
        return {}
    end
    if isPrimitive(head) then
        if not head:canExecute(state) then
            return nil
        end
        local decomposedTail = self:decompose(
            tail,
            head:applyEffects(state)
        )
        return decomposedTail and __TS__ArrayConcat({head}, decomposedTail)
    end
    for ____, method in ipairs(head.methods) do
        do
            if not method:preconditions(state) then
                goto __continue8
            end
            local subtasks = type(method.tasks) == "function" and method.tasks(state) or method.tasks
            local decomposedSubtasks = self:decompose(
                __TS__ArrayConcat(subtasks, tail),
                state
            )
            if decomposedSubtasks then
                return decomposedSubtasks
            end
        end
        ::__continue8::
    end
    return nil
end
return ____exports
 end,
["toolkit.htn.src.htn"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__New = ____lualib.__TS__New
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
local ____executor = require("toolkit.htn.src.executor")
local Executor = ____executor.Executor
local ____planner = require("toolkit.htn.src.planner")
local Planner = ____planner.Planner
function ____exports.getDefaultDeps()
    return {
        executorFactory = function(____, tasks) return __TS__New(Executor, tasks) end,
        plannerFactory = function() return __TS__New(Planner) end
    }
end
____exports.HTN = __TS__Class()
local HTN = ____exports.HTN
HTN.name = "HTN"
function HTN.prototype.____constructor(self, root, deps)
    if deps == nil then
        deps = ____exports.getDefaultDeps()
    end
    self.deps = deps
    self.planner = deps:plannerFactory()
    self.root = root
    self.executor = nil
end
function HTN.prototype.update(self, state, context)
    if not self.executor then
        local ____self_deps_0 = self.deps
        local executorFactory = ____self_deps_0.executorFactory
        local tasks = self.planner:plan(self.root, state)
        if not tasks then
            return
        end
        self.executor = executorFactory(nil, tasks)
    end
    local status = self.executor:update(state, context)
    if status ~= "running" then
        self.executor = nil
    end
end
function HTN.prototype.stop(self, context)
    if not self.executor then
        return
    end
    self.executor:stop(context)
    self.executor = nil
end
return ____exports
 end,
["toolkit.htn.src.factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____htn = require("toolkit.htn.src.htn")
local getDefaultDeps = ____htn.getDefaultDeps
local HTN = ____htn.HTN
____exports.HTNFactory = __TS__Class()
local HTNFactory = ____exports.HTNFactory
HTNFactory.name = "HTNFactory"
function HTNFactory.prototype.____constructor(self, deps)
    if deps == nil then
        deps = getDefaultDeps()
    end
    self.deps = deps
end
function HTNFactory.prototype.create(self, root)
    return __TS__New(HTN, root, self.deps)
end
return ____exports
 end,
["toolkit.htn.src.parallel-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
--- Примитивная задача, которая выполняет две задачи одновременно: основную и фоновую. Завершается
-- с результатом основной и тогда же останавливает фоновую. Если фоновая завершилась ошибкой,
-- останавливает основную и завершается с 'failed'. Например, ждать, пока повезёт, и всё это время
-- проигрывать анимацию. Задачи не должны мешать друг другу: например, нельзя одновременно идти в
-- две стороны
____exports.ParallelTask = __TS__Class()
local ParallelTask = ____exports.ParallelTask
ParallelTask.name = "ParallelTask"
function ParallelTask.prototype.____constructor(self, options)
    self.name = "parallel"
    self.execution = nil
    self.options = options
end
function ParallelTask.prototype.canExecute(self, state)
    local ____self_options_0 = self.options
    local main = ____self_options_0.main
    local background = ____self_options_0.background
    return main:canExecute(state) and background:canExecute(state)
end
function ParallelTask.prototype.applyEffects(self, state)
    return self.options.main:applyEffects(state)
end
function ParallelTask.prototype.start(self, state, context)
    local ____self_options_1 = self.options
    local main = ____self_options_1.main
    local result = main:start(state, context)
    if result ~= "running" then
        return result
    end
    local execution = {isBackgroundRunning = false}
    self.execution = execution
    return self:updateBackground(state, context, execution)
end
function ParallelTask.prototype.update(self, state, context)
    local ____self_options_2 = self.options
    local main = ____self_options_2.main
    local execution = self.execution
    if not execution then
        return "failed"
    end
    local result = main:update(state, context)
    if result ~= "running" then
        self:stopBackground(context, execution)
        return result
    end
    return self:updateBackground(state, context, execution)
end
function ParallelTask.prototype.stop(self, context)
    local execution = self.execution
    if not execution then
        return
    end
    self.options.main:stop(context)
    self:stopBackground(context, execution)
end
function ParallelTask.prototype.updateBackground(self, state, context, execution)
    local ____self_options_3 = self.options
    local main = ____self_options_3.main
    local background = ____self_options_3.background
    local result
    if execution.isBackgroundRunning then
        result = background:update(state, context)
    else
        result = background:canExecute(state) and background:start(state, context) or "failed"
    end
    execution.isBackgroundRunning = result == "running"
    if result == "failed" then
        self.execution = nil
        main:stop(context)
        return "failed"
    end
    return "running"
end
function ParallelTask.prototype.stopBackground(self, context, execution)
    self.execution = nil
    if execution.isBackgroundRunning then
        self.options.background:stop(context)
    end
end
return ____exports
 end,
["toolkit.htn.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____factory = require("toolkit.htn.src.factory")
    ____exports.HTNFactory = ____factory.HTNFactory
end
do
    local ____htn = require("toolkit.htn.src.htn")
    ____exports.HTN = ____htn.HTN
end
do
    local ____parallel_2Dtask = require("toolkit.htn.src.parallel-task")
    ____exports.ParallelTask = ____parallel_2Dtask.ParallelTask
end
return ____exports
 end,
["core.npc.src.state"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.npc.src.root-task-factory"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.npc.src.world-knowledge"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.npc.src.npc"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____events = require("toolkit.events.src.index")
local AbortController = ____events.AbortController
--- NPC склеивает свои данные, актора и HTN-агента
____exports.Npc = __TS__Class()
local Npc = ____exports.Npc
Npc.name = "Npc"
function Npc.prototype.____constructor(self, data, deps)
    local ____deps_0 = deps
    local actorFactory = ____deps_0.actorFactory
    local ticks = ____deps_0.ticks
    local htnFactory = ____deps_0.htnFactory
    local inventoryFactory = ____deps_0.inventoryFactory
    local psycheFactory = ____deps_0.psycheFactory
    local rootTaskFactory = ____deps_0.rootTaskFactory
    local gameSignal = ____deps_0.gameSignal
    local worldKnowledge = ____deps_0.worldKnowledge
    self.id = data.id
    self.worldKnowledge = worldKnowledge
    self.inventory = inventoryFactory:create(data.inventory)
    self.psyche = psycheFactory:create(data.psyche)
    self.lifetime = __TS__New(AbortController)
    self.actor = actorFactory:create({modelId = data.modelId, position = data.spawnPosition, angle = data.spawnAngle})
    self.context = {actor = self.actor, inventory = self.inventory, psyche = self.psyche}
    self.htn = htnFactory:create(rootTaskFactory:create(data.kind))
    ticks:subscribe(
        function() return self.htn:update(
            self:getState(),
            self.context
        ) end,
        {signal = self.lifetime.signal}
    )
    if gameSignal.aborted then
        self:despawn()
        return
    end
    gameSignal:addEventListener(
        "abort",
        function() return self:despawn() end,
        {once = true, signal = self.lifetime.signal}
    )
end
function Npc.prototype.getState(self)
    return {
        self = {
            actor = {
                position = self.actor:getPosition(),
                angle = self.actor:getAngle()
            },
            inventory = self.inventory,
            psyche = self.psyche
        },
        world = self.worldKnowledge:getState()
    }
end
function Npc.prototype.despawn(self)
    self.lifetime:abort()
    self.htn:stop(self.context)
    self.actor:despawn()
end
return ____exports
 end,
["core.npc.src.factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____htn = require("toolkit.htn.src.index")
local HTNFactory = ____htn.HTNFactory
local ____inventory = require("core.inventory.src.index")
local InventoryFactory = ____inventory.InventoryFactory
local ____psyche = require("core.psyche.src.index")
local PsycheFactory = ____psyche.PsycheFactory
local ____npc = require("core.npc.src.npc")
local Npc = ____npc.Npc
____exports.NpcFactory = __TS__Class()
local NpcFactory = ____exports.NpcFactory
NpcFactory.name = "NpcFactory"
function NpcFactory.prototype.____constructor(self, deps)
    local ____deps_0 = deps
    local actorFactory = ____deps_0.actorFactory
    local ticks = ____deps_0.ticks
    local rootTaskFactory = ____deps_0.rootTaskFactory
    local gameSignal = ____deps_0.gameSignal
    local worldKnowledge = ____deps_0.worldKnowledge
    local htnFactory = ____deps_0.htnFactory
    if htnFactory == nil then
        htnFactory = __TS__New(HTNFactory)
    end
    local inventoryFactory = ____deps_0.inventoryFactory
    if inventoryFactory == nil then
        inventoryFactory = __TS__New(InventoryFactory)
    end
    local psycheFactory = ____deps_0.psycheFactory
    if psycheFactory == nil then
        psycheFactory = __TS__New(PsycheFactory)
    end
    self.deps = {
        actorFactory = actorFactory,
        ticks = ticks,
        htnFactory = htnFactory,
        inventoryFactory = inventoryFactory,
        psycheFactory = psycheFactory,
        rootTaskFactory = rootTaskFactory,
        gameSignal = gameSignal,
        worldKnowledge = worldKnowledge
    }
end
function NpcFactory.prototype.create(self, data)
    return __TS__New(Npc, data, self.deps)
end
return ____exports
 end,
["core.npc.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____factory = require("core.npc.src.factory")
    ____exports.NpcFactory = ____factory.NpcFactory
end
do
    local ____kind = require("core.npc.src.kind")
    ____exports.NpcKind = ____kind.NpcKind
end
do
    local ____npc = require("core.npc.src.npc")
    ____exports.Npc = ____npc.Npc
end
return ____exports
 end,
["core.places.src.data"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.PlaceType = ____exports.PlaceType or ({})
____exports.PlaceType.HomelessCamp = "homeless-camp"
____exports.PlaceType.Shop = "shop"
____exports.PlaceType.BottleCollection = "bottle-collection"
____exports.PlaceType.TrashBin = "trash-bin"
____exports.PlaceType.BeggingSpot = "begging-spot"
return ____exports
 end,
["core.places.src.places"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ArrayFilter = ____lualib.__TS__ArrayFilter
local __TS__ArraySlice = ____lualib.__TS__ArraySlice
local __TS__ArrayReduce = ____lualib.__TS__ArrayReduce
local __TS__ArraySome = ____lualib.__TS__ArraySome
local ____exports = {}
____exports.Places = __TS__Class()
local Places = ____exports.Places
Places.name = "Places"
function Places.prototype.____constructor(self, options, deps)
    self.places = options.places
    self.deps = deps
end
function Places.prototype.ofType(self, ____type)
    return __TS__ArrayFilter(
        self.places,
        function(____, place) return place.type == ____type end
    )
end
function Places.prototype.findNearest(self, position, ____type)
    local ____self_deps_0 = self.deps
    local geometry = ____self_deps_0.geometry
    local ____temp_1 = self:ofType(____type)
    local first = ____temp_1[1]
    local rest = __TS__ArraySlice(____temp_1, 1)
    if not first then
        return nil
    end
    return __TS__ArrayReduce(
        rest,
        function(____, nearest, place)
            local distance = geometry:getDistance3d(position, place.position)
            local nearestDistance = geometry:getDistance3d(position, nearest.position)
            return distance < nearestDistance and place or nearest
        end,
        first
    )
end
function Places.prototype.isNear(self, position, ____type, radius)
    local ____self_deps_2 = self.deps
    local geometry = ____self_deps_2.geometry
    return __TS__ArraySome(
        self:ofType(____type),
        function(____, place) return geometry:isWithinRadius3d(position, place.position, radius) end
    )
end
return ____exports
 end,
["core.places.src.factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____places = require("core.places.src.places")
local Places = ____places.Places
____exports.PlacesFactory = __TS__Class()
local PlacesFactory = ____exports.PlacesFactory
PlacesFactory.name = "PlacesFactory"
function PlacesFactory.prototype.____constructor(self, deps)
    self.deps = deps
end
function PlacesFactory.prototype.create(self, options)
    return __TS__New(Places, options, self.deps)
end
return ____exports
 end,
["core.places.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____data = require("core.places.src.data")
    ____exports.PlaceType = ____data.PlaceType
end
do
    local ____factory = require("core.places.src.factory")
    ____exports.PlacesFactory = ____factory.PlacesFactory
end
return ____exports
 end,
["toolkit.random.src.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["toolkit.random.src.random"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local ____exports = {}
--- Источник случайных чисел на Math.random
____exports.Random = __TS__Class()
local Random = ____exports.Random
Random.name = "Random"
function Random.prototype.____constructor(self)
end
function Random.prototype.chance(self, probability)
    if not (probability >= 0 and probability <= 1) then
        error(
            __TS__New(RangeError, "Вероятность должна быть числом от 0 до 1"),
            0
        )
    end
    return math.random() < probability
end
function Random.prototype.pick(self, items)
    local item = items[math.floor(math.random() * #items) + 1]
    if item == nil then
        error(
            __TS__New(RangeError, "Нельзя выбрать из пустого списка"),
            0
        )
    end
    return item
end
return ____exports
 end,
["toolkit.random.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____random = require("toolkit.random.src.random")
    ____exports.Random = ____random.Random
end
return ____exports
 end,
["core.world.src.npc-world-knowledge"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
--- Знание NPC о мире, которое мир собирает из своих источников
____exports.NpcWorldKnowledge = __TS__Class()
local NpcWorldKnowledge = ____exports.NpcWorldKnowledge
NpcWorldKnowledge.name = "NpcWorldKnowledge"
function NpcWorldKnowledge.prototype.____constructor(self, deps)
    self.deps = deps
end
function NpcWorldKnowledge.prototype.getState(self)
    local ____self_deps_0 = self.deps
    local time = ____self_deps_0.time
    return {time = time}
end
return ____exports
 end,
["core.npc-tasks.src.command-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local ____exports = {}
--- Примитивная задача, которая отдаёт команду актору из контекста и выполняется, пока выполняется
-- команда: успешное завершение команды — 'success', ошибка — 'failed'. Наследнику остаётся описать,
-- какую команду отдать актору и какие эффекты применить к состоянию
____exports.CommandTask = __TS__Class()
local CommandTask = ____exports.CommandTask
CommandTask.name = "CommandTask"
function CommandTask.prototype.____constructor(self)
    self.execution = nil
end
function CommandTask.prototype.canExecute(self)
    return true
end
function CommandTask.prototype.start(self, _state, context)
    local execution = {
        command = self:createCommand(context.actor),
        result = "running"
    }
    self.execution = execution
    execution.command:execute():subscribe({
        complete = function()
            execution.result = "success"
        end,
        error = function()
            execution.result = "failed"
        end
    })
    return self:finishIfDone(execution)
end
function CommandTask.prototype.update(self)
    local execution = self.execution
    if not execution then
        return "failed"
    end
    return self:finishIfDone(execution)
end
function CommandTask.prototype.stop(self)
    local execution = self.execution
    if not execution then
        return
    end
    self.execution = nil
    execution.command:cancel(__TS__New(Error, ("Задача " .. self.name) .. " остановлена"))
end
function CommandTask.prototype.finishIfDone(self, execution)
    if execution.result ~= "running" then
        self.execution = nil
    end
    return execution.result
end
return ____exports
 end,
["core.npc-tasks.src.achieve-angle-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____command_2Dtask = require("core.npc-tasks.src.command-task")
local CommandTask = ____command_2Dtask.CommandTask
--- Повернуться на угол (см. IActor.achieveAngle)
____exports.AchieveAngleTask = __TS__Class()
local AchieveAngleTask = ____exports.AchieveAngleTask
AchieveAngleTask.name = "AchieveAngleTask"
__TS__ClassExtends(AchieveAngleTask, CommandTask)
function AchieveAngleTask.prototype.____constructor(self, options, deps)
    CommandTask.prototype.____constructor(self)
    self.name = "achieve-angle"
    self.options = options
    self.deps = deps
end
function AchieveAngleTask.prototype.applyEffects(self, state)
    local ____self_deps_0 = self.deps
    local geometry = ____self_deps_0.geometry
    local angle = geometry:normalizeAngle(self.options.angle)
    local actor = __TS__ObjectAssign({}, state.self.actor, {angle = angle})
    return __TS__ObjectAssign(
        {},
        state,
        {self = __TS__ObjectAssign({}, state.self, {actor = actor})}
    )
end
function AchieveAngleTask.prototype.createCommand(self, actor)
    local ____self_options_1 = self.options
    local angle = ____self_options_1.angle
    local tolerance = ____self_options_1.tolerance
    return actor:achieveAngle(angle, tolerance)
end
return ____exports
 end,
["core.npc-tasks.src.add-item-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
--- Добавить предмет в инвентарь. Задача мгновенная: завершается прямо в start
____exports.AddItemTask = __TS__Class()
local AddItemTask = ____exports.AddItemTask
AddItemTask.name = "AddItemTask"
function AddItemTask.prototype.____constructor(self, options)
    self.name = "add-item"
    self.options = options
end
function AddItemTask.prototype.canExecute(self)
    return true
end
function AddItemTask.prototype.applyEffects(self, state)
    local ____self_options_0 = self.options
    local item = ____self_options_0.item
    local count = ____self_options_0.count
    local inventory = state.self.inventory:clone()
    inventory:add(item, count)
    return __TS__ObjectAssign(
        {},
        state,
        {self = __TS__ObjectAssign({}, state.self, {inventory = inventory})}
    )
end
function AddItemTask.prototype.start(self, _state, context)
    local ____self_options_1 = self.options
    local item = ____self_options_1.item
    local count = ____self_options_1.count
    context.inventory:add(item, count)
    return "success"
end
function AddItemTask.prototype.update(self)
    return "failed"
end
function AddItemTask.prototype.stop(self)
end
return ____exports
 end,
["core.npc-tasks.src.go-to-coords-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
local ____command_2Dtask = require("core.npc-tasks.src.command-task")
local CommandTask = ____command_2Dtask.CommandTask
--- Идти к координатам (см. IActor.goToCoords)
____exports.GoToCoordsTask = __TS__Class()
local GoToCoordsTask = ____exports.GoToCoordsTask
GoToCoordsTask.name = "GoToCoordsTask"
__TS__ClassExtends(GoToCoordsTask, CommandTask)
function GoToCoordsTask.prototype.____constructor(self, options)
    CommandTask.prototype.____constructor(self)
    self.name = "go-to-coords"
    self.options = options
end
function GoToCoordsTask.prototype.applyEffects(self, state)
    local ____self_options_0 = self.options
    local coords = ____self_options_0.coords
    local actor = __TS__ObjectAssign({}, state.self.actor, {position = coords})
    return __TS__ObjectAssign(
        {},
        state,
        {self = __TS__ObjectAssign({}, state.self, {actor = actor})}
    )
end
function GoToCoordsTask.prototype.createCommand(self, actor)
    local ____self_options_1 = self.options
    local coords = ____self_options_1.coords
    local completeRadius = ____self_options_1.completeRadius
    return actor:goToCoords(coords, completeRadius)
end
return ____exports
 end,
["core.npc-tasks.src.play-animation-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local ____command_2Dtask = require("core.npc-tasks.src.command-task")
local CommandTask = ____command_2Dtask.CommandTask
--- Проиграть анимацию (см. IActor.playAnimation)
____exports.PlayAnimationTask = __TS__Class()
local PlayAnimationTask = ____exports.PlayAnimationTask
PlayAnimationTask.name = "PlayAnimationTask"
__TS__ClassExtends(PlayAnimationTask, CommandTask)
function PlayAnimationTask.prototype.____constructor(self, options)
    CommandTask.prototype.____constructor(self)
    self.name = "play-animation"
    self.options = options
end
function PlayAnimationTask.prototype.applyEffects(self, state)
    return state
end
function PlayAnimationTask.prototype.createCommand(self, actor)
    local ____self_options_0 = self.options
    local animation = ____self_options_0.animation
    local duration = ____self_options_0.duration
    return actor:playAnimation(animation, duration)
end
return ____exports
 end,
["core.npc-tasks.src.psyche-react-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
--- Отреагировать на поступок: сообщить психике NPC о поступке, чтобы поменялись чувства. Задача
-- мгновенная: завершается прямо в start. О чертах задача не знает, как поступок меняет чувства,
-- решает психика
____exports.PsycheReactTask = __TS__Class()
local PsycheReactTask = ____exports.PsycheReactTask
PsycheReactTask.name = "PsycheReactTask"
function PsycheReactTask.prototype.____constructor(self, options)
    self.name = "psyche-react"
    self.options = options
end
function PsycheReactTask.prototype.canExecute(self)
    return true
end
function PsycheReactTask.prototype.applyEffects(self, state)
    local psyche = state.self.psyche:clone()
    psyche:react(self.options.deed)
    return __TS__ObjectAssign(
        {},
        state,
        {self = __TS__ObjectAssign({}, state.self, {psyche = psyche})}
    )
end
function PsycheReactTask.prototype.start(self, _state, context)
    context.psyche:react(self.options.deed)
    return "success"
end
function PsycheReactTask.prototype.update(self)
    return "failed"
end
function PsycheReactTask.prototype.stop(self)
end
return ____exports
 end,
["core.npc-tasks.src.remove-item-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
--- Отнять предмет из инвентаря. Выполнить можно, только если предмета хватает. Задача мгновенная:
-- завершается прямо в start
____exports.RemoveItemTask = __TS__Class()
local RemoveItemTask = ____exports.RemoveItemTask
RemoveItemTask.name = "RemoveItemTask"
function RemoveItemTask.prototype.____constructor(self, options)
    self.name = "remove-item"
    self.options = options
end
function RemoveItemTask.prototype.canExecute(self, state)
    local ____self_options_0 = self.options
    local item = ____self_options_0.item
    local count = ____self_options_0.count
    return state.self.inventory:get(item) >= count
end
function RemoveItemTask.prototype.applyEffects(self, state)
    local ____self_options_1 = self.options
    local item = ____self_options_1.item
    local count = ____self_options_1.count
    local inventory = state.self.inventory:clone()
    inventory:remove(item, count)
    return __TS__ObjectAssign(
        {},
        state,
        {self = __TS__ObjectAssign({}, state.self, {inventory = inventory})}
    )
end
function RemoveItemTask.prototype.start(self, _state, context)
    local ____self_options_2 = self.options
    local item = ____self_options_2.item
    local count = ____self_options_2.count
    return context.inventory:remove(item, count) and "success" or "failed"
end
function RemoveItemTask.prototype.update(self)
    return "failed"
end
function RemoveItemTask.prototype.stop(self)
end
return ____exports
 end,
["core.npc-tasks.src.try-luck-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____events = require("toolkit.events.src.index")
local AbortController = ____events.AbortController
--- Пытать удачу: раз в TryLuckTask.PERIOD бросать шанс, пока не повезёт. Шанс поправляет психика NPC,
-- например, удачливым везёт чаще. Когда повезло, задача завершается с 'success', и план
-- продолжается следующими задачами: что получил NPC, решают они
____exports.TryLuckTask = __TS__Class()
local TryLuckTask = ____exports.TryLuckTask
TryLuckTask.name = "TryLuckTask"
function TryLuckTask.prototype.____constructor(self, options, deps)
    self.name = "try-luck"
    self.attempts = nil
    self.options = options
    self.deps = deps
end
function TryLuckTask.prototype.canExecute(self, state)
    return not self:shouldStop(state)
end
function TryLuckTask.prototype.applyEffects(self, state)
    local ____self_options_0 = self.options
    local applyEffects = ____self_options_0.applyEffects
    return applyEffects and applyEffects(nil, state) or state
end
function TryLuckTask.prototype.start(self, _state, context)
    local ____self_deps_1 = self.deps
    local random = ____self_deps_1.random
    local timer = ____self_deps_1.timer
    local ____self_options_2 = self.options
    local chance = ____self_options_2.chance
    local onAttempt = ____self_options_2.onAttempt
    local attempts = {
        lifetime = __TS__New(AbortController),
        isLucky = false
    }
    self:stopAttempts()
    self.attempts = attempts
    timer:interval(____exports.TryLuckTask.PERIOD):subscribe(
        function()
            if onAttempt ~= nil then
                onAttempt(nil, context)
            end
            if random:chance(context.psyche:adjustChance(chance)) then
                attempts.isLucky = true
                attempts.lifetime:abort()
            end
        end,
        {signal = attempts.lifetime.signal}
    )
    return "running"
end
function TryLuckTask.prototype.update(self, state)
    local attempts = self.attempts
    if not attempts then
        return "failed"
    end
    if attempts.isLucky then
        self.attempts = nil
        return "success"
    end
    if self:shouldStop(state) then
        self:stopAttempts()
        return "failed"
    end
    return "running"
end
function TryLuckTask.prototype.stop(self)
    self:stopAttempts()
end
function TryLuckTask.prototype.shouldStop(self, state)
    local ____self_options_5 = self.options
    local stopWhen = ____self_options_5.stopWhen
    local ____stopWhen_6
    if stopWhen then
        ____stopWhen_6 = stopWhen(nil, state)
    else
        ____stopWhen_6 = false
    end
    return ____stopWhen_6
end
function TryLuckTask.prototype.stopAttempts(self)
    local ____opt_7 = self.attempts
    if ____opt_7 ~= nil then
        ____opt_7.lifetime:abort()
    end
    self.attempts = nil
end
TryLuckTask.PERIOD = 1000
return ____exports
 end,
["core.npc-tasks.src.factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____htn = require("toolkit.htn.src.index")
local ParallelTask = ____htn.ParallelTask
local ____achieve_2Dangle_2Dtask = require("core.npc-tasks.src.achieve-angle-task")
local AchieveAngleTask = ____achieve_2Dangle_2Dtask.AchieveAngleTask
local ____add_2Ditem_2Dtask = require("core.npc-tasks.src.add-item-task")
local AddItemTask = ____add_2Ditem_2Dtask.AddItemTask
local ____go_2Dto_2Dcoords_2Dtask = require("core.npc-tasks.src.go-to-coords-task")
local GoToCoordsTask = ____go_2Dto_2Dcoords_2Dtask.GoToCoordsTask
local ____play_2Danimation_2Dtask = require("core.npc-tasks.src.play-animation-task")
local PlayAnimationTask = ____play_2Danimation_2Dtask.PlayAnimationTask
local ____psyche_2Dreact_2Dtask = require("core.npc-tasks.src.psyche-react-task")
local PsycheReactTask = ____psyche_2Dreact_2Dtask.PsycheReactTask
local ____remove_2Ditem_2Dtask = require("core.npc-tasks.src.remove-item-task")
local RemoveItemTask = ____remove_2Ditem_2Dtask.RemoveItemTask
local ____try_2Dluck_2Dtask = require("core.npc-tasks.src.try-luck-task")
local TryLuckTask = ____try_2Dluck_2Dtask.TryLuckTask
____exports.NpcTaskFactory = __TS__Class()
local NpcTaskFactory = ____exports.NpcTaskFactory
NpcTaskFactory.name = "NpcTaskFactory"
function NpcTaskFactory.prototype.____constructor(self, deps)
    self.deps = deps
end
function NpcTaskFactory.prototype.goToCoords(self, options)
    return __TS__New(GoToCoordsTask, options)
end
function NpcTaskFactory.prototype.achieveAngle(self, options)
    return __TS__New(AchieveAngleTask, options, self.deps)
end
function NpcTaskFactory.prototype.playAnimation(self, options)
    return __TS__New(PlayAnimationTask, options)
end
function NpcTaskFactory.prototype.addItem(self, options)
    return __TS__New(AddItemTask, options)
end
function NpcTaskFactory.prototype.removeItem(self, options)
    return __TS__New(RemoveItemTask, options)
end
function NpcTaskFactory.prototype.psycheReact(self, options)
    return __TS__New(PsycheReactTask, options)
end
function NpcTaskFactory.prototype.tryLuck(self, options)
    local ____self_deps_0 = self.deps
    local random = ____self_deps_0.random
    local timer = ____self_deps_0.timer
    return __TS__New(TryLuckTask, options, {random = random, timer = timer})
end
function NpcTaskFactory.prototype.parallel(self, options)
    return __TS__New(ParallelTask, options)
end
return ____exports
 end,
["core.npc-tasks.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____factory = require("core.npc-tasks.src.factory")
    ____exports.NpcTaskFactory = ____factory.NpcTaskFactory
end
return ____exports
 end,
["core.homeless.src.purchase-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
local ____inventory = require("core.inventory.src.index")
local Item = ____inventory.Item
--- Купить предмет там, где NPC стоит: заплатить и получить предмет. Деньги и предмет меняются, только
-- когда NPC расплатился. Купить можно, только если денег хватает
____exports.PurchaseTask = __TS__Class()
local PurchaseTask = ____exports.PurchaseTask
PurchaseTask.name = "PurchaseTask"
function PurchaseTask.prototype.____constructor(self, options, deps)
    self.name = "purchase"
    local ____options_0 = options
    local item = ____options_0.item
    local count = ____options_0.count
    local price = ____options_0.price
    local ____deps_1 = deps
    local npcTaskFactory = ____deps_1.npcTaskFactory
    self.methods = {{
        name = "pay",
        preconditions = function(____, state) return state.self.inventory:get(Item.Money) >= price end,
        tasks = {
            npcTaskFactory:playAnimation({animation = "pay"}),
            npcTaskFactory:removeItem({item = Item.Money, count = price}),
            npcTaskFactory:addItem({item = item, count = count})
        }
    }}
end
return ____exports
 end,
["core.homeless.src.types"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["core.homeless.src.root-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
--- Корневая задача бомжа: жить. Методы перечислены по приоритету: бухать, а если не получается —
-- купить пойло, а если и это не получается — сдать бутылки, а если и это не получается — клянчить, а
-- иначе — собирать бутылки. Когда что получается, решают предусловия самих задач: бухать можно,
-- если есть пойло, купить — если хватает денег, сдать — если за бутылки хватит на пойло, клянчить —
-- если стыд ниже порога, собирать — если NPC унесёт ещё бутылку
____exports.HomelessRootTask = __TS__Class()
local HomelessRootTask = ____exports.HomelessRootTask
HomelessRootTask.name = "HomelessRootTask"
function HomelessRootTask.prototype.____constructor(self, deps)
    self.name = "live"
    local ____deps_0 = deps
    local homelessTaskFactory = ____deps_0.homelessTaskFactory
    self.methods = {
        {
            name = "drink",
            preconditions = function() return true end,
            tasks = {homelessTaskFactory:drink()}
        },
        {
            name = "buy-booze",
            preconditions = function() return true end,
            tasks = {homelessTaskFactory:buyBooze()}
        },
        {
            name = "sell-bottles",
            preconditions = function() return true end,
            tasks = {homelessTaskFactory:sellBottles()}
        },
        {
            name = "beg",
            preconditions = function() return true end,
            tasks = {homelessTaskFactory:beg()}
        },
        {
            name = "collect-bottles",
            preconditions = function() return true end,
            tasks = {homelessTaskFactory:collectBottles()}
        }
    }
end
return ____exports
 end,
["core.homeless.src.constants"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
--- Цена бутылки пойла, в долларах
____exports.BOOZE_PRICE = 100
--- Сколько платят за одну пустую бутылку, в долларах
____exports.BOTTLE_PRICE = 10
--- Шанс найти бутылку за одну попытку, раз в секунду (см. TryLuckTask)
____exports.BOTTLE_FIND_CHANCE = 1 / 60
--- Сколько бутылок NPC ищет в мусорке за один заход
____exports.MAX_BOTTLES_PER_VISIT = 5
--- Сколько бутылок NPC может унести
____exports.MAX_BOTTLES = 15
--- Шанс выклянчить деньги за одну попытку, раз в секунду (см. TryLuckTask)
____exports.BEGGING_CHANCE = 1 / 40
--- Сколько долларов NPC получает, когда удалось выклянчить
____exports.BEGGING_REWARD = 10
--- Стыд, при котором NPC перестаёт клянчить. Подобран вместе с приростом стыда за попытку (см.
-- BEGGING_SHAME в
-- 
-- @peetland /psyche): при средней совестливости и нулевом стартовом стыде порог
-- достигается примерно за 600 попыток. Чтобы с пустыми карманами наклянчить на пойло, в среднем
-- нужно 400 попыток, поэтому одной сессии клянчанья хватает на пойло примерно в 93% случаев
____exports.BEGGING_SHAME_LIMIT = 60
return ____exports
 end,
["core.homeless.src.beg-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__ArrayPush = ____lualib.__TS__ArrayPush
local ____exports = {}
local ____inventory = require("core.inventory.src.index")
local Item = ____inventory.Item
local ____places = require("core.places.src.index")
local PlaceType = ____places.PlaceType
local ____psyche = require("core.psyche.src.index")
local Deed = ____psyche.Deed
local Feeling = ____psyche.Feeling
local ____constants = require("core.homeless.src.constants")
local BEGGING_CHANCE = ____constants.BEGGING_CHANCE
local BEGGING_REWARD = ____constants.BEGGING_REWARD
local BEGGING_SHAME_LIMIT = ____constants.BEGGING_SHAME_LIMIT
local BOOZE_PRICE = ____constants.BOOZE_PRICE
local BOTTLE_PRICE = ____constants.BOTTLE_PRICE
--- Клянчить: один заход к ближайшему месту для клянчанья. NPC сидит с анимацией и раз в секунду с
-- шансом BEGGING_CHANCE получает BEGGING_REWARD, пока не наклянчит столько, сколько ему не хватает
-- на пойло вместе с деньгами и бутылками, которые у него есть. Каждая попытка, удачная или нет, —
-- поступок Deed.Begging, от которого растёт стыд. Когда стыд достигает BEGGING_SHAME_LIMIT, NPC
-- перестаёт клянчить.
-- 
-- Клянчить NPC идёт, только если это окупится: по предсказанию, он успеет наклянчить на пойло до
-- того, как стыд достигнет порога. Стыд предсказывается так, будто на каждую удачу уходит столько
-- попыток, сколько NPC ожидает при шансе BEGGING_CHANCE: оптимист рассчитывает на меньшее число
-- попыток, пессимист — на большее
____exports.BegTask = __TS__Class()
local BegTask = ____exports.BegTask
BegTask.name = "BegTask"
function BegTask.prototype.____constructor(self, deps)
    self.name = "beg"
    self.places = deps.places
    self.deps = deps
    self.methods = {{
        name = "beg-at-nearest-spot",
        preconditions = function(____, state) return self:canBeg(state) end,
        tasks = function(state) return self:begAtNearestSpot(state) end
    }}
end
function BegTask.prototype.canBeg(self, state)
    local rewards = self:countNeededRewards(state)
    return rewards > 0 and self:countRewardsBeforeShame(state.self.psyche, rewards) == rewards and #self.places:ofType(PlaceType.BeggingSpot) > 0
end
function BegTask.prototype.begAtNearestSpot(self, state)
    local ____self_deps_0 = self.deps
    local npcTaskFactory = ____self_deps_0.npcTaskFactory
    local spot = self.places:findNearest(state.self.actor.position, PlaceType.BeggingSpot)
    if not spot then
        error(
            __TS__New(Error, "Не из чего выбрать место для клянчанья"),
            0
        )
    end
    local tasks = {
        npcTaskFactory:goToCoords({coords = spot.position, completeRadius = ____exports.BegTask.SPOT_COMPLETE_RADIUS}),
        npcTaskFactory:achieveAngle({angle = spot.angle, tolerance = ____exports.BegTask.SPOT_FACING_TOLERANCE})
    }
    do
        local index = 0
        while index < self:countNeededRewards(state) do
            __TS__ArrayPush(
                tasks,
                npcTaskFactory:parallel({
                    main = npcTaskFactory:tryLuck({
                        chance = BEGGING_CHANCE,
                        stopWhen = function(____, current) return self:isAshamed(current.self.psyche) end,
                        onAttempt = function(____, context) return context.psyche:react(Deed.Begging) end,
                        applyEffects = function(____, current) return __TS__ObjectAssign(
                            {},
                            current,
                            {self = __TS__ObjectAssign(
                                {},
                                current.self,
                                {psyche = self:predictReward(current.self.psyche)}
                            )}
                        ) end
                    }),
                    background = npcTaskFactory:playAnimation({animation = "beg-sitting"})
                }),
                npcTaskFactory:addItem({item = Item.Money, count = BEGGING_REWARD})
            )
            index = index + 1
        end
    end
    return tasks
end
function BegTask.prototype.countNeededRewards(self, state)
    local money = state.self.inventory:get(Item.Money)
    local bottles = state.self.inventory:get(Item.Bottles)
    local shortfall = BOOZE_PRICE - money - bottles * BOTTLE_PRICE
    return math.max(
        0,
        math.ceil(shortfall / BEGGING_REWARD)
    )
end
function BegTask.prototype.countRewardsBeforeShame(self, psyche, limit)
    local rewards = 0
    local current = psyche
    while rewards < limit and not self:isAshamed(current) do
        rewards = rewards + 1
        current = self:predictReward(current)
    end
    return rewards
end
function BegTask.prototype.predictReward(self, current)
    local psyche = current:clone()
    local attempts = psyche:expectAttempts(BEGGING_CHANCE)
    do
        local attempt = 0
        while attempt < attempts do
            psyche:react(Deed.Begging)
            attempt = attempt + 1
        end
    end
    return psyche
end
function BegTask.prototype.isAshamed(self, psyche)
    return psyche:getState().feelings[Feeling.Shame] >= BEGGING_SHAME_LIMIT
end
BegTask.SPOT_COMPLETE_RADIUS = 0.5
BegTask.SPOT_FACING_TOLERANCE = 15
return ____exports
 end,
["core.homeless.src.buy-booze-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____inventory = require("core.inventory.src.index")
local Item = ____inventory.Item
local ____places = require("core.places.src.index")
local PlaceType = ____places.PlaceType
local ____constants = require("core.homeless.src.constants")
local BOOZE_PRICE = ____constants.BOOZE_PRICE
--- Купить пойло в ближайшем магазине, если на него хватает денег. Магазин выбирается при планировании по позиции NPC, один раз
-- на весь план
____exports.BuyBoozeTask = __TS__Class()
local BuyBoozeTask = ____exports.BuyBoozeTask
BuyBoozeTask.name = "BuyBoozeTask"
function BuyBoozeTask.prototype.____constructor(self, deps)
    self.name = "buy-booze"
    self.places = deps.places
    self.deps = deps
    self.methods = {{
        name = "buy-in-nearest-shop",
        preconditions = function(____, state) return self:canBuy(state) end,
        tasks = function(state) return self:buyInNearestShop(state) end
    }}
end
function BuyBoozeTask.prototype.canBuy(self, state)
    local money = state.self.inventory:get(Item.Money)
    return money >= BOOZE_PRICE and #self.places:ofType(PlaceType.Shop) > 0
end
function BuyBoozeTask.prototype.buyInNearestShop(self, state)
    local ____self_deps_0 = self.deps
    local homelessTaskFactory = ____self_deps_0.homelessTaskFactory
    local npcTaskFactory = ____self_deps_0.npcTaskFactory
    local shop = self.places:findNearest(state.self.actor.position, PlaceType.Shop)
    if not shop then
        error(
            __TS__New(Error, "Не из чего выбрать магазин"),
            0
        )
    end
    return {
        npcTaskFactory:goToCoords({coords = shop.position, completeRadius = ____exports.BuyBoozeTask.SHOP_COMPLETE_RADIUS}),
        npcTaskFactory:achieveAngle({angle = shop.angle, tolerance = ____exports.BuyBoozeTask.SHOP_FACING_TOLERANCE}),
        homelessTaskFactory:purchase({item = Item.Booze, count = 1, price = BOOZE_PRICE})
    }
end
BuyBoozeTask.SHOP_COMPLETE_RADIUS = 0.5
BuyBoozeTask.SHOP_FACING_TOLERANCE = 15
return ____exports
 end,
["core.homeless.src.collect-bottles-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ArrayPush = ____lualib.__TS__ArrayPush
local ____exports = {}
local ____inventory = require("core.inventory.src.index")
local Item = ____inventory.Item
local ____places = require("core.places.src.index")
local PlaceType = ____places.PlaceType
local ____psyche = require("core.psyche.src.index")
local Deed = ____psyche.Deed
local ____constants = require("core.homeless.src.constants")
local BOTTLE_FIND_CHANCE = ____constants.BOTTLE_FIND_CHANCE
local MAX_BOTTLES = ____constants.MAX_BOTTLES
local MAX_BOTTLES_PER_VISIT = ____constants.MAX_BOTTLES_PER_VISIT
--- Собрать бутылки: один заход к случайной мусорке. NPC роется в ней с анимацией, пока не найдёт
-- MAX_BOTTLES_PER_VISIT бутылок или пока не наберёт MAX_BOTTLES. Каждая найденная бутылка — поступок
-- Deed.BottleFound: бомж сам зарабатывает и не попрошайничает, и стыд от этого падает. Мусорка и сколько бутылок искать
-- определяются при планировании, один раз на весь план. Следующий заход — следующий план
____exports.CollectBottlesTask = __TS__Class()
local CollectBottlesTask = ____exports.CollectBottlesTask
CollectBottlesTask.name = "CollectBottlesTask"
function CollectBottlesTask.prototype.____constructor(self, deps)
    self.name = "collect-bottles"
    self.places = deps.places
    self.deps = deps
    self.methods = {{
        name = "search-random-trash-bin",
        preconditions = function(____, state) return self:canCollect(state) end,
        tasks = function(state) return self:searchRandomTrashBin(state) end
    }}
end
function CollectBottlesTask.prototype.canCollect(self, state)
    return self:countBottles(state) < MAX_BOTTLES and #self.places:ofType(PlaceType.TrashBin) > 0
end
function CollectBottlesTask.prototype.searchRandomTrashBin(self, state)
    local ____self_deps_0 = self.deps
    local random = ____self_deps_0.random
    local npcTaskFactory = ____self_deps_0.npcTaskFactory
    local bin = random:pick(self.places:ofType(PlaceType.TrashBin))
    local bottles = math.min(
        MAX_BOTTLES_PER_VISIT,
        MAX_BOTTLES - self:countBottles(state)
    )
    local tasks = {
        npcTaskFactory:goToCoords({coords = bin.position, completeRadius = ____exports.CollectBottlesTask.TRASH_BIN_COMPLETE_RADIUS}),
        npcTaskFactory:achieveAngle({angle = bin.angle, tolerance = ____exports.CollectBottlesTask.TRASH_BIN_FACING_TOLERANCE}),
        npcTaskFactory:playAnimation({animation = "trash-search-start"})
    }
    do
        local index = 0
        while index < bottles do
            __TS__ArrayPush(
                tasks,
                npcTaskFactory:parallel({
                    main = npcTaskFactory:tryLuck({chance = BOTTLE_FIND_CHANCE}),
                    background = npcTaskFactory:playAnimation({animation = "trash-search"})
                }),
                npcTaskFactory:playAnimation({animation = "trash-search-pocket"}),
                npcTaskFactory:addItem({item = Item.Bottles, count = 1}),
                npcTaskFactory:psycheReact({deed = Deed.BottleFound})
            )
            index = index + 1
        end
    end
    tasks[#tasks + 1] = npcTaskFactory:playAnimation({animation = "trash-search-end"})
    return tasks
end
function CollectBottlesTask.prototype.countBottles(self, state)
    return state.self.inventory:get(Item.Bottles)
end
CollectBottlesTask.TRASH_BIN_COMPLETE_RADIUS = 0.5
CollectBottlesTask.TRASH_BIN_FACING_TOLERANCE = 15
return ____exports
 end,
["core.homeless.src.drink-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local hasBooze
local ____inventory = require("core.inventory.src.index")
local Item = ____inventory.Item
local ____places = require("core.places.src.index")
local PlaceType = ____places.PlaceType
function hasBooze(state)
    return state.self.inventory:get(Item.Booze) > 0
end
--- Бухать: выпить бутылку пойла в бомжарне, если пойло есть. Если NPC не в бомжарне, сначала он
-- идёт к ближайшей. Когда NPC допил, пойло отнимается, а пустая бутылка остаётся в инвентаре
____exports.DrinkTask = __TS__Class()
local DrinkTask = ____exports.DrinkTask
DrinkTask.name = "DrinkTask"
function DrinkTask.prototype.____constructor(self, deps)
    self.name = "drink"
    local ____deps_0 = deps
    local npcTaskFactory = ____deps_0.npcTaskFactory
    local drink = {
        npcTaskFactory:playAnimation({animation = "drink-standing-1", duration = ____exports.DrinkTask.DURATION}),
        npcTaskFactory:removeItem({item = Item.Booze, count = 1}),
        npcTaskFactory:addItem({item = Item.Bottles, count = 1})
    }
    self.places = deps.places
    self.deps = deps
    self.methods = {
        {
            name = "drink-in-camp",
            preconditions = function(____, state) return hasBooze(state) and self:isInCamp(state) end,
            tasks = drink
        },
        {
            name = "go-to-camp-and-drink",
            preconditions = function(____, state) return hasBooze(state) and #self.places:ofType(PlaceType.HomelessCamp) > 0 end,
            tasks = function(state) return {
                self:goToNearestCamp(state),
                unpack(drink)
            } end
        }
    }
end
function DrinkTask.prototype.isInCamp(self, state)
    return self.places:isNear(state.self.actor.position, PlaceType.HomelessCamp, ____exports.DrinkTask.CAMP_RADIUS)
end
function DrinkTask.prototype.goToNearestCamp(self, state)
    local ____self_deps_1 = self.deps
    local npcTaskFactory = ____self_deps_1.npcTaskFactory
    local camp = self.places:findNearest(state.self.actor.position, PlaceType.HomelessCamp)
    if not camp then
        error(
            __TS__New(Error, "Не из чего выбрать бомжарню"),
            0
        )
    end
    return npcTaskFactory:goToCoords({coords = camp.position, completeRadius = ____exports.DrinkTask.CAMP_COMPLETE_RADIUS})
end
DrinkTask.DURATION = 10000
DrinkTask.CAMP_RADIUS = 3
DrinkTask.CAMP_COMPLETE_RADIUS = 0.5
return ____exports
 end,
["core.homeless.src.sell-bottles-task"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____inventory = require("core.inventory.src.index")
local Item = ____inventory.Item
local ____places = require("core.places.src.index")
local PlaceType = ____places.PlaceType
local ____constants = require("core.homeless.src.constants")
local BOOZE_PRICE = ____constants.BOOZE_PRICE
local BOTTLE_PRICE = ____constants.BOTTLE_PRICE
--- Сдать бутылки в ближайшей приёмке: все бутылки, по BOTTLE_PRICE за штуку. Приёмка и количество
-- бутылок определяются при планировании, один раз на весь план. Сдавать идёт, только если есть
-- что сдать и после сдачи денег хватит на пойло
____exports.SellBottlesTask = __TS__Class()
local SellBottlesTask = ____exports.SellBottlesTask
SellBottlesTask.name = "SellBottlesTask"
function SellBottlesTask.prototype.____constructor(self, deps)
    self.name = "sell-bottles"
    self.places = deps.places
    self.deps = deps
    self.methods = {{
        name = "sell-in-nearest-collection",
        preconditions = function(____, state) return self:canSell(state) end,
        tasks = function(state) return self:sellInNearestCollection(state) end
    }}
end
function SellBottlesTask.prototype.canSell(self, state)
    local money = state.self.inventory:get(Item.Money)
    local bottles = self:countBottles(state)
    return bottles > 0 and money + bottles * BOTTLE_PRICE >= BOOZE_PRICE and #self.places:ofType(PlaceType.BottleCollection) > 0
end
function SellBottlesTask.prototype.sellInNearestCollection(self, state)
    local ____self_deps_0 = self.deps
    local npcTaskFactory = ____self_deps_0.npcTaskFactory
    local collection = self.places:findNearest(state.self.actor.position, PlaceType.BottleCollection)
    if not collection then
        error(
            __TS__New(Error, "Не из чего выбрать приёмку"),
            0
        )
    end
    local bottles = self:countBottles(state)
    return {
        npcTaskFactory:goToCoords({coords = collection.position, completeRadius = ____exports.SellBottlesTask.COLLECTION_COMPLETE_RADIUS}),
        npcTaskFactory:achieveAngle({angle = collection.angle, tolerance = ____exports.SellBottlesTask.COLLECTION_FACING_TOLERANCE}),
        npcTaskFactory:playAnimation({animation = "item-give"}),
        npcTaskFactory:removeItem({item = Item.Bottles, count = bottles}),
        npcTaskFactory:addItem({item = Item.Money, count = bottles * BOTTLE_PRICE})
    }
end
function SellBottlesTask.prototype.countBottles(self, state)
    return state.self.inventory:get(Item.Bottles)
end
SellBottlesTask.COLLECTION_COMPLETE_RADIUS = 0.5
SellBottlesTask.COLLECTION_FACING_TOLERANCE = 15
return ____exports
 end,
["core.homeless.src.factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____beg_2Dtask = require("core.homeless.src.beg-task")
local BegTask = ____beg_2Dtask.BegTask
local ____buy_2Dbooze_2Dtask = require("core.homeless.src.buy-booze-task")
local BuyBoozeTask = ____buy_2Dbooze_2Dtask.BuyBoozeTask
local ____collect_2Dbottles_2Dtask = require("core.homeless.src.collect-bottles-task")
local CollectBottlesTask = ____collect_2Dbottles_2Dtask.CollectBottlesTask
local ____drink_2Dtask = require("core.homeless.src.drink-task")
local DrinkTask = ____drink_2Dtask.DrinkTask
local ____purchase_2Dtask = require("core.homeless.src.purchase-task")
local PurchaseTask = ____purchase_2Dtask.PurchaseTask
local ____sell_2Dbottles_2Dtask = require("core.homeless.src.sell-bottles-task")
local SellBottlesTask = ____sell_2Dbottles_2Dtask.SellBottlesTask
____exports.HomelessTaskFactory = __TS__Class()
local HomelessTaskFactory = ____exports.HomelessTaskFactory
HomelessTaskFactory.name = "HomelessTaskFactory"
function HomelessTaskFactory.prototype.____constructor(self, deps)
    self.deps = deps
end
function HomelessTaskFactory.prototype.purchase(self, options)
    local ____self_deps_0 = self.deps
    local npcTaskFactory = ____self_deps_0.npcTaskFactory
    return __TS__New(PurchaseTask, options, {npcTaskFactory = npcTaskFactory})
end
function HomelessTaskFactory.prototype.buyBooze(self)
    local ____self_deps_1 = self.deps
    local npcTaskFactory = ____self_deps_1.npcTaskFactory
    local places = ____self_deps_1.places
    return __TS__New(BuyBoozeTask, {npcTaskFactory = npcTaskFactory, homelessTaskFactory = self, places = places})
end
function HomelessTaskFactory.prototype.drink(self)
    local ____self_deps_2 = self.deps
    local npcTaskFactory = ____self_deps_2.npcTaskFactory
    local places = ____self_deps_2.places
    return __TS__New(DrinkTask, {npcTaskFactory = npcTaskFactory, places = places})
end
function HomelessTaskFactory.prototype.sellBottles(self)
    local ____self_deps_3 = self.deps
    local npcTaskFactory = ____self_deps_3.npcTaskFactory
    local places = ____self_deps_3.places
    return __TS__New(SellBottlesTask, {npcTaskFactory = npcTaskFactory, places = places})
end
function HomelessTaskFactory.prototype.collectBottles(self)
    local ____self_deps_4 = self.deps
    local npcTaskFactory = ____self_deps_4.npcTaskFactory
    local places = ____self_deps_4.places
    local random = ____self_deps_4.random
    return __TS__New(CollectBottlesTask, {npcTaskFactory = npcTaskFactory, places = places, random = random})
end
function HomelessTaskFactory.prototype.beg(self)
    local ____self_deps_5 = self.deps
    local npcTaskFactory = ____self_deps_5.npcTaskFactory
    local places = ____self_deps_5.places
    return __TS__New(BegTask, {npcTaskFactory = npcTaskFactory, places = places})
end
return ____exports
 end,
["core.homeless.src.root-task-factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____npc_2Dtasks = require("core.npc-tasks.src.index")
local NpcTaskFactory = ____npc_2Dtasks.NpcTaskFactory
local ____factory = require("core.homeless.src.factory")
local HomelessTaskFactory = ____factory.HomelessTaskFactory
local ____root_2Dtask = require("core.homeless.src.root-task")
local HomelessRootTask = ____root_2Dtask.HomelessRootTask
--- Создаёт корневые задачи бомжа (см. HomelessRootTask). Задачи бомжа собирает сама, а снаружи
-- получает только то, что общее для всего мира
____exports.HomelessRootTaskFactory = __TS__Class()
local HomelessRootTaskFactory = ____exports.HomelessRootTaskFactory
HomelessRootTaskFactory.name = "HomelessRootTaskFactory"
function HomelessRootTaskFactory.prototype.____constructor(self, deps)
    local ____deps_0 = deps
    local geometry = ____deps_0.geometry
    local places = ____deps_0.places
    local random = ____deps_0.random
    local timer = ____deps_0.timer
    local npcTaskFactory = ____deps_0.npcTaskFactory
    if npcTaskFactory == nil then
        npcTaskFactory = __TS__New(NpcTaskFactory, {geometry = geometry, random = random, timer = timer})
    end
    local homelessTaskFactory = ____deps_0.homelessTaskFactory
    if homelessTaskFactory == nil then
        homelessTaskFactory = __TS__New(HomelessTaskFactory, {npcTaskFactory = npcTaskFactory, places = places, random = random})
    end
    self.homelessTaskFactory = homelessTaskFactory
end
function HomelessRootTaskFactory.prototype.create(self)
    local homelessTaskFactory = self.homelessTaskFactory
    return __TS__New(HomelessRootTask, {homelessTaskFactory = homelessTaskFactory})
end
return ____exports
 end,
["core.homeless.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____root_2Dtask = require("core.homeless.src.root-task")
    ____exports.HomelessRootTask = ____root_2Dtask.HomelessRootTask
end
do
    local ____root_2Dtask_2Dfactory = require("core.homeless.src.root-task-factory")
    ____exports.HomelessRootTaskFactory = ____root_2Dtask_2Dfactory.HomelessRootTaskFactory
end
return ____exports
 end,
["core.world.src.root-task-factory"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectRest = ____lualib.__TS__ObjectRest
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____homeless = require("core.homeless.src.index")
local HomelessRootTaskFactory = ____homeless.HomelessRootTaskFactory
local ____npc = require("core.npc.src.index")
local NpcKind = ____npc.NpcKind
--- Создаёт корневую задачу NPC фабрикой его типа
____exports.RootTaskFactory = __TS__Class()
local RootTaskFactory = ____exports.RootTaskFactory
RootTaskFactory.name = "RootTaskFactory"
function RootTaskFactory.prototype.____constructor(self, deps)
    local ____deps_0 = deps
    local kindFactories = ____deps_0.kindFactories
    if kindFactories == nil then
        kindFactories = {}
    end
    local shared = __TS__ObjectRest(____deps_0, {kindFactories = true})
    self.kindFactories = {[NpcKind.Homeless] = kindFactories[NpcKind.Homeless] or __TS__New(HomelessRootTaskFactory, shared)}
end
function RootTaskFactory.prototype.create(self, kind)
    local kindFactories = self.kindFactories
    return kindFactories[kind]:create()
end
return ____exports
 end,
["core.world.src.world"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__AsyncAwaiter = ____lualib.__TS__AsyncAwaiter
local __TS__Await = ____lualib.__TS__Await
local ____exports = {}
local ____npc = require("core.npc.src.index")
local NpcFactory = ____npc.NpcFactory
local ____places = require("core.places.src.index")
local PlacesFactory = ____places.PlacesFactory
local ____psyche = require("core.psyche.src.index")
local PsycheFactory = ____psyche.PsycheFactory
local ____random = require("toolkit.random.src.index")
local Random = ____random.Random
local ____timings = require("toolkit.timings.src.index")
local Timer = ____timings.Timer
local ____npc_2Dworld_2Dknowledge = require("core.world.src.npc-world-knowledge")
local NpcWorldKnowledge = ____npc_2Dworld_2Dknowledge.NpcWorldKnowledge
local ____root_2Dtask_2Dfactory = require("core.world.src.root-task-factory")
local RootTaskFactory = ____root_2Dtask_2Dfactory.RootTaskFactory
____exports.World = __TS__Class()
local World = ____exports.World
World.name = "World"
function World.prototype.____constructor(self, options, deps)
    if deps == nil then
        deps = {}
    end
    self.options = options
    self.deps = deps
end
function World.prototype.bigBang(self)
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        local ____self_options_0 = self.options
        local game = ____self_options_0.game
        local npcs = ____self_options_0.npcs
        local places = ____self_options_0.places
        local ____self_deps_1 = self.deps
        local random = ____self_deps_1.random
        if random == nil then
            random = __TS__New(Random)
        end
        local timer = ____self_deps_1.timer
        if timer == nil then
            timer = __TS__New(Timer)
        end
        local psycheFactory = ____self_deps_1.psycheFactory
        if psycheFactory == nil then
            psycheFactory = __TS__New(PsycheFactory)
        end
        local placesFactory = ____self_deps_1.placesFactory
        if placesFactory == nil then
            placesFactory = __TS__New(PlacesFactory, {geometry = game.geometry})
        end
        local worldKnowledge = ____self_deps_1.worldKnowledge
        if worldKnowledge == nil then
            worldKnowledge = __TS__New(NpcWorldKnowledge, {time = game.time})
        end
        local worldPlaces = placesFactory:create({places = __TS__Await(places:getAll())})
        local ____self_deps_2 = self.deps
        local rootTaskFactory = ____self_deps_2.rootTaskFactory
        if rootTaskFactory == nil then
            rootTaskFactory = __TS__New(RootTaskFactory, {geometry = game.geometry, places = worldPlaces, random = random, timer = timer})
        end
        local npcFactory = ____self_deps_2.npcFactory
        if npcFactory == nil then
            npcFactory = __TS__New(NpcFactory, {
                actorFactory = game.actorFactory,
                ticks = game.ticks,
                psycheFactory = psycheFactory,
                rootTaskFactory = rootTaskFactory,
                gameSignal = game.signal,
                worldKnowledge = worldKnowledge
            })
        end
        for ____, data in ipairs(__TS__Await(npcs:getAll())) do
            npcFactory:create(data)
        end
    end)
end
return ____exports
 end,
["core.world.src.index"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
do
    local ____world = require("core.world.src.world")
    ____exports.World = ____world.World
end
return ____exports
 end,
["src.data.npcs"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____npc = require("core.npc.src.index")
local NpcKind = ____npc.NpcKind
local ____psyche = require("core.psyche.src.index")
local Feeling = ____psyche.Feeling
local Trait = ____psyche.Trait
____exports.npcs = {{
    id = "peet",
    kind = NpcKind.Homeless,
    modelId = 230,
    spawnPosition = {x = 1271.41, y = 181.76, z = 19.44},
    spawnAngle = 242,
    psyche = {traits = {[Trait.Conscientiousness] = 100, [Trait.Luck] = 50, [Trait.Optimism] = 50}, feelings = {[Feeling.Shame] = 0}},
    inventory = {}
}}
return ____exports
 end,
["src.data.places"] = function(...) 
--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____places = require("core.places.src.index")
local PlaceType = ____places.PlaceType
____exports.places = {
    {id = "montgomery-homeless-camp", position = {x = 1271.41, y = 181.76, z = 19.44}, angle = 242, type = PlaceType.HomelessCamp},
    {id = "montgomery-hannibal-liquor-kiosk", position = {x = 1321.81, y = 352.54, z = 19.55}, angle = 67, type = PlaceType.Shop},
    {id = "montgomery-liquor-deli", position = {x = 1359.61, y = 205.1, z = 19.75}, angle = 157, type = PlaceType.Shop},
    {id = "montgomery-hannibal-liquor-kiosk-backdoor", position = {x = 1311.13, y = 351.59, z = 19.55}, angle = 336, type = PlaceType.BottleCollection},
    {id = "montgomery-begging-spot", position = {x = 1213.24, y = 296.77, z = 19.55}, angle = 19, type = PlaceType.BeggingSpot},
    {id = "montgomery-trash-bin-1", position = {x = 1314.91, y = 348.57, z = 19.55}, angle = 335, type = PlaceType.TrashBin},
    {id = "montgomery-trash-bin-2", position = {x = 1308.07, y = 350.72, z = 19.55}, angle = 158, type = PlaceType.TrashBin},
    {id = "montgomery-trash-bin-3", position = {x = 1300.07, y = 220.54, z = 19.55}, angle = 338, type = PlaceType.TrashBin},
    {id = "montgomery-trash-bin-4", position = {x = 1320.22, y = 210.51, z = 19.55}, angle = 339, type = PlaceType.TrashBin},
    {id = "montgomery-trash-bin-5", position = {x = 1328.07, y = 206.68, z = 19.55}, angle = 314, type = PlaceType.TrashBin},
    {id = "montgomery-trash-bin-6", position = {x = 1352.64, y = 204.68, z = 19.55}, angle = 244, type = PlaceType.TrashBin},
    {id = "montgomery-trash-bin-7", position = {x = 1352.11, y = 201.4, z = 19.55}, angle = 286, type = PlaceType.TrashBin},
    {id = "montgomery-trash-bin-8", position = {x = 1361.59, y = 231.67, z = 19.56}, angle = 333, type = PlaceType.TrashBin},
    {id = "montgomery-trash-bin-9", position = {x = 1364.07, y = 230.46, z = 19.56}, angle = 342, type = PlaceType.TrashBin},
    {id = "montgomery-trash-bin-10", position = {x = 1368.35, y = 483.13, z = 20.02}, angle = 337, type = PlaceType.TrashBin}
}
return ____exports
 end,
["src.patch-global"] = function(...) 
local ____lualib = require("lualib_bundle")
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__Spread = ____lualib.__TS__Spread
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__InstanceOf = ____lualib.__TS__InstanceOf
local ____exports = {}
local reportError
local ____moonloader = require("moonloader.src.index")
local lua_thread = ____moonloader.lua_thread
local localClock = ____moonloader.localClock
local ____print = ____moonloader.print
local wait = ____moonloader.wait
function reportError(____error)
    local ____temp_0
    if __TS__InstanceOf(____error, Error) then
        ____temp_0 = ____error.stack
    else
        ____temp_0 = nil
    end
    local stack = ____temp_0
    ____print("Ошибка: " .. tostring(____error))
    if stack then
        ____print(stack)
    end
end
--- Все таймеры живут в одном потоке, который запускает startTimers. Отдельный поток на каждый таймер
-- не годится: поток, созданный из колбэка другого таймера, после первого wait не продолжается
local timers = __TS__New(Map)
local lastTimerId = 0
--- Текущее время в миллисекундах от запуска скрипта
local function now()
    return localClock() * 1000
end
local function schedule(callback, delay, args, ____repeat)
    lastTimerId = lastTimerId + 1
    local id = lastTimerId
    timers:set(
        id,
        {
            callback = callback,
            args = args,
            delay = delay,
            dueAt = now() + delay,
            ["repeat"] = ____repeat
        }
    )
    return id
end
--- Вызывает колбэки таймеров, которым пора сработать
local function runDueTimers()
    local time = now()
    for ____, ____value in ipairs({__TS__Spread(timers)}) do
        local id = ____value[1]
        local timer = ____value[2]
        do
            if not timers:has(id) or timer.dueAt > time then
                goto __continue5
            end
            if timer["repeat"] then
                timer.dueAt = math.max(timer.dueAt + timer.delay, time)
            else
                timers:delete(id)
            end
            do
                local function ____catch(____error)
                    reportError(____error)
                end
                local ____try, ____hasReturned = pcall(function()
                    timer.callback(unpack(timer.args))
                end)
                if not ____try then
                    ____catch(____hasReturned)
                end
            end
        end
        ::__continue5::
    end
end
--- Запускает поток, который каждый кадр вызывает колбэки таймеров. Вызывается один раз из main:
-- до этого setTimeout и setInterval только запоминают таймеры
-- 
-- @param canRun - можно ли сейчас вызывать колбэки. Пока нельзя, таймеры не срабатывают, а после
-- срабатывают те, которым пора
function ____exports.startTimers(canRun)
    lua_thread.create(function()
        while true do
            wait(0)
            if canRun() then
                runDueTimers()
            end
        end
    end)
end
local function setTimeout(callback, timeout, ...)
    if timeout == nil then
        timeout = 0
    end
    local args = {...}
    return schedule(callback, timeout, args, false)
end
local function setInterval(callback, timeout, ...)
    if timeout == nil then
        timeout = 0
    end
    local args = {...}
    return schedule(callback, timeout, args, true)
end
local function clearTimer(timerId)
    timers:delete(timerId)
end
_G.setTimeout = setTimeout
_G.clearTimeout = clearTimer
_G.setInterval = setInterval
_G.clearInterval = clearTimer
_G.reportError = reportError
return ____exports
 end,
["src.main"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__New = ____lualib.__TS__New
local __TS__AsyncAwaiter = ____lualib.__TS__AsyncAwaiter
local __TS__Await = ____lualib.__TS__Await
local ____exports = {}
local ____gta_2Dsa = require("gta-sa.src.index")
local GtaGame = ____gta_2Dsa.GtaGame
local ____moonloader = require("moonloader.src.index")
local getCharCoordinates = ____moonloader.getCharCoordinates
local getCharHeading = ____moonloader.getCharHeading
local isGamePaused = ____moonloader.isGamePaused
local isPlayerPlaying = ____moonloader.isPlayerPlaying
local ____math = ____moonloader.math
local os = ____moonloader.os
local ____print = ____moonloader.print
local wait = ____moonloader.wait
local wasKeyPressed = ____moonloader.wasKeyPressed
local PLAYER_HANDLE = ____moonloader.PLAYER_HANDLE
local PLAYER_PED = ____moonloader.PLAYER_PED
local setCharCoordinates = ____moonloader.setCharCoordinates
local ____repository = require("toolkit.repository.src.index")
local InMemoryRepository = ____repository.InMemoryRepository
local ____world = require("core.world.src.index")
local World = ____world.World
local ____vkeys = require("vkeys")
local VK_G = ____vkeys.VK_G
local VK_H = ____vkeys.VK_H
local VK_J = ____vkeys.VK_J
local ____npcs = require("src.data.npcs")
local npcs = ____npcs.npcs
local ____places = require("src.data.places")
local places = ____places.places
local ____patch_2Dglobal = require("src.patch-global")
local startTimers = ____patch_2Dglobal.startTimers
--- Можно ли сейчас что-то делать в игре: она загружена, игрок управляет персонажем и не на паузе
local function isGameRunning()
    return isPlayerPlaying(PLAYER_HANDLE) and not isGamePaused()
end
--- Создаёт мир в игре с местами и NPC из данных мода и запускает в нём жизнь
-- 
-- @param game - игра, в которой создаётся мир
local function bigBang(game)
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        __TS__Await(__TS__New(
            World,
            {
                game = game,
                places = __TS__New(InMemoryRepository, places),
                npcs = __TS__New(InMemoryRepository, npcs)
            }
        ):bigBang())
    end)
end
local function main()
    ____math.randomseed(os.time())
    while not isPlayerPlaying(PLAYER_HANDLE) do
        wait(100)
    end
    startTimers(isGameRunning)
    while true do
        do
            wait(40)
            if not isGameRunning() then
                goto __continue6
            end
            if wasKeyPressed(VK_G) then
                local x, y, z = getCharCoordinates(PLAYER_PED)
                local angle = getCharHeading(PLAYER_PED)
                ____print((((((("x: " .. tostring(x)) .. ", y: ") .. tostring(y)) .. ", z: ") .. tostring(z)) .. ", angle: ") .. tostring(angle))
            end
            if wasKeyPressed(VK_H) then
                bigBang(__TS__New(GtaGame)):catch(function(____, ____error) return reportError(____error) end)
            end
            if wasKeyPressed(VK_J) then
                setCharCoordinates(PLAYER_PED, 1267.41, 177.76, 19.44)
            end
        end
        ::__continue6::
    end
end
_G.main = main
return ____exports
 end,
}
local ____entry = require("src.main", ...)
return ____entry
