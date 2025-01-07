const lambda = require('../../../src/api/checklists.js'); 
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');
const mockdate = require('mockdate');

// Mock uuid
const uuidvalue = 'f8216640-91a2-11eb-8ab9-57aa454facef'
jest.mock('uuid', () => ({ v1: () =>  uuidvalue}));


describe('Test checklists handler', () => { 
    let scanSpy, getSpy, deleteSpy, putSpy; 

    beforeAll(() => { 
        // Mock dynamodb methods
        
        scanSpy = jest.spyOn(DynamoDBDocument.prototype, 'scan'); 
        putSpy = jest.spyOn(DynamoDBDocument.prototype, 'put'); 

        // Mock other functions
        mockdate.set(1600000000000)
    }); 
 
    // Clean up mocks 
    afterAll(() => { 
        scanSpy.mockRestore(); 
        putSpy.mockRestore(); 
        mockdate.reset();
    }); 
 

    it('should add new checklist item', async () => { 
        const item = {};
         
        // Return the specified value whenever the spied function is called 
        putSpy.mockReturnValue(item); 

        const event = { 
            "routeKey": "POST /api/checklists",
            "rawPath": "/api/checklists",
            "requestContext": {
                "requestId":"e0GDshQXoAMEJug="
            },
            "body": JSON.stringify({"name": "The Venetian","description": "Las Vegas"}),
        } 

        requestJSON = JSON.parse(event.body);
        const newItem = {
            id: uuidvalue,
            name: requestJSON.name,
            description: requestJSON.description,
            dateCreated: new Date().toISOString()
  
        }
 
        // Invoke Lambda handler 
        const result = await lambda.handler(event); 
 
        const expectedNewItemResult = { 
            statusCode: 200, 
            body: JSON.stringify(newItem),
            headers : {
                "Content-Type": "application/json"
              }
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedNewItemResult); 
    }); 

    it("should throw an error if http method is not a POST", async () => {
        // function throw_error_on_wrong_http_method() {
    
        const expected = {};
    
        putSpy.mockReturnValue(expected); 
    
        const event = {
          httpMethod: "GET",
          body: JSON.stringify(expected),
        };
    
        expect(async () => {
          await putItemHandler(event);
          console.log("============================= "+received);
        }).rejects.toThrow();
      });

      it('should add new checklist item', async () => { 
        const item = {};
         
        // Return the specified value whenever the spied function is called 
        putSpy.mockReturnValue(item); 

        const event = { 
            "routeKey": "POST /checklists",
            "rawPath": "/checklists",
            "requestContext": {
                "requestId":"e0GDshQXoAMEJug="
            },
            "body": JSON.stringify({"name": "The Venetian","description": "Las Vegas"}),
        } 

        requestJSON = JSON.parse(event.body);
        const newItem = {
            id: uuidvalue,
            name: requestJSON.name,
            description: requestJSON.description,
            dateCreated: new Date().toISOString()
  
        }
 
        // Invoke Lambda handler 
        const result = await lambda.handler(event); 
 
        const expectedNewItemResult = { 
            statusCode: 200, 
            body: JSON.stringify(newItem),
            headers : {
                "Content-Type": "application/json"
              }
        }; 
 
        // Compare the result with the expected result 
        expect(async () => {
            await putItemHandler(event);
            console.log(received);
          }).rejects.toThrow();
    }); 

     it('should return list of checklist items', async () => { 
        const items =  {
            "Items": [
                {
                    "id": "f8216640-91a2-11eb-8ab9-57aa454facef",
                    "name": "The Venetian",
                    "description": "Las Vegas",
                    "dateCreated": "2024-12-19T21:57:49.860Z"
                },
                {
                    "id": "31a9f940-917b-11eb-9054-67837e2c40b0",
                    "name": "Encore",
                    "description": "Las Vegas",
                    "dateCreated": "2024-12-19T21:57:49.860Z"
                }
            ],
            "Count": 2,
            "ScannedCount": 2
        };
 
        // Return the specified value whenever the spied function is called 
        scanSpy.mockReturnValue(items); 
 
        const event = { 
            "routeKey": "GET /api/checklists",
            "rawPath": "/api/checklists",
            "requestContext": {
                "requestId":"e0GDshQXoAMEJug="
            }
        } 
 
        // Invoke Lambda handler 
        const result = await lambda.handler(event); 
 
        const expectedResult = { 
            statusCode: 200, 
            body: JSON.stringify(items),
            headers : {
                "Content-Type": "application/json"
              }
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 

}); 
