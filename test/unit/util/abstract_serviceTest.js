/*
 * Copyright (c) 2016 Michael Krotscheck.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AbstractService from "../../../src/util/abstract_service";
import * as mockData from '../helpers/data/versions'; // Might as well use keystone
import fetchMock from "fetch-mock";

describe('AbstractService', () => {

  afterEach(fetchMock.restore);

  it('should provide a singleton HTTP instance', () => {
    let service = new AbstractService(mockData.rootUrl, mockData.versions);

    expect(service._http).toBeUndefined();
    let http1 = service.http;
    expect(service._http).toBeDefined();
    expect(http1).not.toBeNull();
    let http2 = service.http;
    expect(http1).toBe(http2);
  });

  it('should return supported versions', () => {
    let service = new AbstractService(mockData.rootUrl, mockData.versions);
    expect(service.supportedVersions).toEqual(mockData.versions);
  });

  it('should return an empty array if no versions are configured', () => {
    let service = new AbstractService(mockData.rootUrl, null);
    expect(service.supportedVersions).toEqual([]);
  });

  describe("versions()", () => {

    it("Should return a list of all versions available from this resource", (done) => {
      const service = new AbstractService(mockData.rootUrl, mockData.versions);

      fetchMock.mock(mockData.rootResponse());

      service.versions()
        .then((versions) => {
          // Quick sanity check.
          expect(versions.length).toBe(6);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should return a list of all versions available from this resource", (done) => {
      const service = new AbstractService(mockData.rootUrl, mockData.versions);

      fetchMock.mock(mockData.rootResponse());

      service.versions()
        .then((versions) => {
          // Quick sanity check.
          expect(versions.length).toBe(6);
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should NOT cache its results", (done) => {
      const service = new AbstractService(mockData.rootUrl, mockData.versions);
      const mockOptions = mockData.rootResponse();

      fetchMock.mock(mockOptions);

      service.versions()
        .then(() => {
          // Validate that the mock has only been invoked once
          expect(fetchMock.calls(mockOptions.name).length).toEqual(1);
          return service.versions();
        })
        .then(() => {
          expect(fetchMock.calls(mockOptions.name).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("version()", () => {

    it("Should return a supported version of the service API.", (done) => {
      const service = new AbstractService(mockData.rootUrl, mockData.versions);

      fetchMock.mock(mockData.rootResponse());

      service.version()
        .then((version) => {
          expect(version.id).toEqual('v2.3');
          done();
        })
        .catch((error) => done.fail(error));
    });

    it("Should throw an exception if no supported version is found.", (done) => {
      const service = new AbstractService(mockData.rootUrl, mockData.versions);

      // Build an invalid mock object.
      const mockOptions = mockData.rootResponse();
      mockOptions.response.versions.shift();

      fetchMock.mock(mockOptions);

      service.version()
        .then((response) => done.fail(response))
        .catch((error) => {
          expect(error).not.toBeNull();
          done();
        });
    });

    it("Should NOT cache its results", (done) => {
      const service = new AbstractService(mockData.rootUrl, mockData.versions);
      const mockOptions = mockData.rootResponse();
      fetchMock.mock(mockOptions);

      service.version()
        .then(() => {
          // Validate that the mock has only been invoked once
          expect(fetchMock.calls(mockOptions.name).length).toEqual(1);
          return service.version();
        })
        .then(() => {
          expect(fetchMock.calls(mockOptions.name).length).toEqual(2);
          done();
        })
        .catch((error) => done.fail(error));
    });
  });
});
