import React, { useState, useEffect } from "react";
import "../styles/ResidentList.css";
import Header from "../components/Header";
import { api } from '../api/api';

const ResidentList = () => {
  const [residents, setResidents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [healthProgress, setHealthProgress] = useState([]);
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResident, setSelectedResident] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedResident, setEditedResident] = useState(null);

  useEffect(() => {
    fetchResidents();
    fetchActivities();
    fetchHealthProgress();
    fetchMeals();
  }, []);

  const BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000/api/v1'
  : 'https://semi-lifeec.onrender.com/api/v1';

  const api = {
    get: async (endpoint) => {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || response.statusText);
        return data;
      } catch (error) {
        console.error(`GET Error (${endpoint}):`, error);
        throw error;
      }
    },
    
    post: async (endpoint, data) => {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.message || response.statusText);
        return responseData;
      } catch (error) {
        console.error(`POST Error (${endpoint}):`, error);
        throw error;
      }
    },
    
    put: async (endpoint, data) => {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.message || response.statusText);
        return responseData;
      } catch (error) {
        console.error(`PUT Error (${endpoint}):`, error);
        throw error;
      }
    },

    delete: async (endpoint) => {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || response.statusText);
        }
        return true;
      } catch (error) {
        console.error(`DELETE Error (${endpoint}):`, error);
        throw error;
      }
    }
  };

const fetchResidents = async () => {
  try {
    const data = await api.get('/patient/list');
    setResidents(data);
  } catch (error) {
    console.error("Error fetching residents:", error);
  }
};

const fetchActivities = async () => {
  try {
    const data = await api.get('/activities/list');
    setActivities(data.activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

const fetchHealthProgress = async () => {
  try {
    const data = await api.get('/health-progress/list');
    setHealthProgress(data);
  } catch (error) {
    console.error("Error fetching health progress:", error);
  }
};

const fetchMeals = async () => {
  try {
    const data = await api.get('/meal/list');
    setMeals(data);
  } catch (error) {
    console.error("Error fetching meals:", error);
  }
};

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectResident = (resident) => {
    const residentActivities = activities.filter(activity => activity.residentId === resident._id);
    const residentHealthProgress = healthProgress.filter(progress => progress.residentId === resident._id);
    const residentMeals = meals.filter(meal => meal.residentId === resident._id);
    
    setSelectedResident({ 
      ...resident, 
      activities: residentActivities, 
      healthProgress: residentHealthProgress,
      meals: residentMeals
    });
    setEditedResident({ 
      ...resident, 
      activities: residentActivities, 
      healthProgress: residentHealthProgress,
      meals: residentMeals
    });
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedResident(selectedResident);
  };

  const handleInputChange = (e, field, index = null, subField = null) => {
    const { value } = e.target;
    setEditedResident((prevState) => {
      if (index !== null && subField) {
        const updatedArray = [...prevState[field]];
        updatedArray[index] = {
          ...updatedArray[index],
          [subField]: value,
        };
        return {
          ...prevState,
          [field]: updatedArray
        };
      } else {
        return {
          ...prevState,
          [field]: value,
        };
      }
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSelectedResident(editedResident);
  
    if (editedResident?.healthProgress) {
      for (let progress of editedResident.healthProgress) {
        try {
          await api.put(`/health-progress/${progress._id}`, progress);
        } catch (error) {
          console.error('Error updating health progress:', error);
        }
      }
    }
  
    if (editedResident?.meals) {
      for (let meal of editedResident.meals) {
        try {
          await api.put(`/meal/${meal._id}`, meal);
        } catch (error) {
          console.error('Error updating meal:', error);
        }
      }
    }
  
    if (editedResident?.activities) {
      for (let activity of editedResident.activities) {
        try {
          await api.put(`/activities/${activity._id}`, activity);
        } catch (error) {
          console.error('Error updating activity:', error);
        }
      }
    }
  
    setIsEditing(false);
  };
  
  
  const handlePrint = () => {
    window.print();
  };

  // Add a function to send an emergency alert
  const sendEmergencyAlert = async () => {
    if (!selectedResident) {
      alert("Please select a resident to send an emergency alert.");
      return;
    }
  
    console.log("Selected resident for alert:", selectedResident);
  
    try {
      if (!selectedResident._id || !selectedResident.name) {
        throw new Error("Resident ID or name is missing");
      }
  
      const alertData = {
        residentId: selectedResident._id,
        residentName: selectedResident.name,
        message: `Emergency alert triggered for ${selectedResident.name}`,
        timestamp: new Date().toISOString()
      };
  
      console.log("Sending emergency alert data:", alertData);
  
      const result = await api.post('/emergency-alerts', alertData);
      console.log("Emergency alert sent successfully:", result);
      alert(`Emergency alert has been triggered for ${selectedResident.name}`);
  
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      alert(`Failed to send emergency alert: ${error.message}`);
    }
  };

  const handleEmergencyAlert = () => {
    sendEmergencyAlert();
  };

  const filteredResidents = residents.filter((resident) =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeForInput = (time) => {
    if (!time) return '';
    // If time is already in HH:mm format, return as is
    if (/^\d{2}:\d{2}$/.test(time)) return time;
    // If time is in 12-hour format, convert to 24-hour format
    const [timePart, ampm] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    if (ampm === 'PM' && hours !== '12') {
      hours = String(Number(hours) + 12);
    } else if (ampm === 'AM' && hours === '12') {
      hours = '00';
    }
    return `${hours.padStart(2, '0')}:${minutes}`;
  };
  
  const formatTimeForDisplay = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Header />
      <div className="resident-list-component">
        <section className="resident-list">
          <h1>Resident List</h1>
        <div className="form-group">
          <label htmlFor="residentSearch">Search Resident:</label>
          <input
            type="text"
            id="residentSearch"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter resident name"
          />
        </div>
        <div className="resident-options">
          {filteredResidents.map((resident, index) => (
            <div
              key={index}
              className="resident-option"
              onClick={() => handleSelectResident(resident)}
            >
              {resident.name}
            </div>
          ))}
        </div>

        {selectedResident && (
          <div className="resident-details">
            {/* Basic Information */}
            <div className="resident-section">
              <h3>Basic Information</h3>
              {isEditing ? (
                <>
                  <label>Name: </label>
                  <input
                    type="text"
                    value={editedResident?.name || ""}
                    onChange={(e) => handleInputChange(e, "name")}
                  />
                  <label>Age:</label>
                  <input
                    type="text"
                    value={editedResident?.age || ""}
                    onChange={(e) => handleInputChange(e, "age")}
                  />
                  <label>Gender: </label>
                  <input
                    type="text"
                    value={editedResident?.gender || ""}
                    onChange={(e) => handleInputChange(e, "gender")}
                  />
                  <label>Contact: </label>
                  <input
                    type="text"
                    value={editedResident?.contact || ""}
                    onChange={(e) => handleInputChange(e, "contact")}
                  />
                  <label>Emergency Contact Name: </label>
                  <input
                    type="text"
                    value={editedResident?.emergencyContact?.name || ""}
                    onChange={(e) =>
                      handleInputChange(e, "emergencyContact", "name")
                    }
                  />
                  <label>Emergency Contact Phone: </label>
                  <input
                    type="text"
                    value={editedResident?.emergencyContact?.phone || ""}
                    onChange={(e) =>
                      handleInputChange(e, "emergencyContact", "phone")
                    }
                  />
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {selectedResident.name || 'N/A'}</p>
                  <p><strong>Age:</strong> {selectedResident.age || 'N/A'}</p>
                  <p><strong>Gender:</strong> {selectedResident.gender || 'N/A'}</p>
                  <p><strong>Contact:</strong> {selectedResident.contact || 'N/A'}</p>

                  <h2>Emergency Contacts</h2>
                  <p><strong>Emergency Contact Name:</strong> {selectedResident.emergencyContact.name || 'N/A'}</p>
                  <p><strong>Emergency Contact Phone:</strong> {selectedResident.emergencyContact.phone || 'N/A'}</p>
                </>
              )}
            </div>

              {/* Health Management */}
              <div className="resident-section">
                <h3>Health Management</h3>
                {isEditing ? (
                  <>
                    {editedResident.healthProgress.map((record, index) => (
                      <div key={record._id}>
                        <label>Allergies: </label>
                        <input
                          type="text"
                          value={record.allergies || record.allergy || ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].allergies = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                        <label>Medical Condition: </label>
                        <input
                          type="text"
                          value={record.medicalCondition || ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].medicalCondition = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                        <label>Date: </label>
                        <input
                          type="date"
                          value={record.date ? new Date(record.date).toISOString().split('T')[0] : ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].date = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                        <label>Status: </label>
                        <select
                          value={record.status || ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].status = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        >
                          <option value="stable">Stable</option>
                          <option value="critical">Critical</option>
                          <option value="improving">Improving</option>
                          <option value="declining">Declining</option>
                        </select>
                        <label>Current Medication: </label>
                        <input
                          type="text"
                          value={record.currentMedication || ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].currentMedication = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                        <label>Dosage: </label>
                        <input
                          type="text"
                          value={record.dosage || ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].dosage = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                        <label>Quantity: </label>
                        <input
                          type="number"
                          value={record.quantity || ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].quantity = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                        <label>Medication: </label>
                        <input
                          type="text"
                          value={record.medication || ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].medication = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                        <label>Time: </label>
                        <input
                          type="time"
                          value={formatTimeForInput(record.time) || ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].time = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                        <label>Taken: </label>
                        <input
                          type="checkbox"
                          checked={record.taken || false}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].taken = e.target.checked;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                        <label>Health Assessment: </label>
                        <textarea
                          value={record.healthAssessment || ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].healthAssessment = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                        <label>Administration Instruction: </label>
                        <textarea
                          value={record.administrationInstruction || ""}
                          onChange={(e) => {
                            const updatedHealthProgress = [...editedResident.healthProgress];
                            updatedHealthProgress[index].administrationInstruction = e.target.value;
                            setEditedResident({...editedResident, healthProgress: updatedHealthProgress});
                          }}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {selectedResident?.healthProgress && selectedResident.healthProgress.length > 0 ? (
                      selectedResident.healthProgress.map((healthProgress) => (
                        <div key={healthProgress._id} className="health-progress">

                          <h2>Health Progress</h2>
                          <p><strong>Allergies:</strong> {healthProgress.allergies || healthProgress.allergy}</p>
                          <p><strong>Medical Condition:</strong> {healthProgress.medicalCondition}</p>
                          <p><strong>Date:</strong> {new Date(healthProgress.date).toLocaleDateString()}</p>
                          <p><strong>Status:</strong> {healthProgress.status}</p>

                          <h2>Medications</h2>
                          <p><strong>Current Medication:</strong> {healthProgress.currentMedication}</p>
                          <p><strong>Dosage:</strong> {healthProgress.dosage}</p>
                          <p><strong>Quantity:</strong> {healthProgress.quantity}</p>

                          <h2>Medication Schedule</h2>
                          <p><strong>Medication:</strong> {healthProgress.medication}</p>
                          <p><strong>Time:</strong> {formatTimeForDisplay(healthProgress.time)}</p>
                          <p><strong>Taken:</strong> {healthProgress.taken ? 'Yes' : 'No'}</p>

                          <h2>Care Plans</h2>
                          <p><strong>Health Assessment:</strong> {healthProgress.healthAssessment}</p>
                          <p><strong>Administration Instruction:</strong> {healthProgress.administrationInstruction}</p>
                        </div>
                      ))
                    ) : (
                      <p>No health management records for this resident.</p>
                    )}
                  </>
                )}
              </div>

        {/* Meal Management */}
        <div className="resident-section">
          <h3>Meal Management</h3>
          {isEditing ? (
            <>
              {editedResident.meals.map((meal, index) => (
                <div key={meal._id}>
                  <label>Dietary Needs: </label>
                  <input
                    type="text"
                    value={meal.dietaryNeeds || ""}
                    onChange={(e) => {
                      const updatedMeals = [...editedResident.meals];
                      updatedMeals[index].dietaryNeeds = e.target.value;
                      setEditedResident({...editedResident, meals: updatedMeals});
                    }}
                  />
                  <label>Nutritional Goals: </label>
                  <input
                    type="text"
                    value={meal.nutritionalGoals || ""}
                    onChange={(e) => {
                      const updatedMeals = [...editedResident.meals];
                      updatedMeals[index].nutritionalGoals = e.target.value;
                      setEditedResident({...editedResident, meals: updatedMeals});
                    }}
                  />
                  <label>Date: </label>
                  <input
                    type="date"
                    value={meal.date ? new Date(meal.date).toISOString().split('T')[0] : ""}
                    onChange={(e) => {
                      const updatedMeals = [...editedResident.meals];
                      updatedMeals[index].date = e.target.value;
                      setEditedResident({...editedResident, meals: updatedMeals});
                    }}
                  />
                  <label>Breakfast: </label>
                  <input
                    type="text"
                    value={meal.breakfast.join(", ") || ""}
                    onChange={(e) => {
                      const updatedMeals = [...editedResident.meals];
                      updatedMeals[index].breakfast = e.target.value.split(", ");
                      setEditedResident({...editedResident, meals: updatedMeals});
                    }}
                  />
                  <label>Lunch: </label>
                  <input
                    type="text"
                    value={meal.lunch.join(", ") || ""}
                    onChange={(e) => {
                      const updatedMeals = [...editedResident.meals];
                      updatedMeals[index].lunch = e.target.value.split(", ");
                      setEditedResident({...editedResident, meals: updatedMeals});
                    }}
                  />
                  <label>Snacks: </label>
                  <input
                    type="text"
                    value={meal.snacks.join(", ") || ""}
                    onChange={(e) => {
                      const updatedMeals = [...editedResident.meals];
                      updatedMeals[index].snacks = e.target.value.split(", ");
                      setEditedResident({...editedResident, meals: updatedMeals});
                    }}
                  />
                  <label>Dinner: </label>
                  <input
                    type="text"
                    value={meal.dinner.join(", ") || ""}
                    onChange={(e) => {
                      const updatedMeals = [...editedResident.meals];
                      updatedMeals[index].dinner = e.target.value.split(", ");
                      setEditedResident({...editedResident, meals: updatedMeals});
                    }}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {selectedResident?.meals && selectedResident.meals.length > 0 ? (
                selectedResident.meals.map((meal) => (
                  <div key={meal._id} className="meal-record">
                    <p><strong>Dietary Needs:</strong> {meal.dietaryNeeds}</p>
                    <p><strong>Nutritional Goals:</strong> {meal.nutritionalGoals}</p>
                    <p><strong>Date:</strong> {new Date(meal.date).toLocaleDateString()}</p>
                    <h2>Meals</h2>
                    <p><strong>Breakfast:</strong> {meal.breakfast.join(", ")}</p>
                    <p><strong>Lunch:</strong> {meal.lunch.join(", ")}</p>
                    <p><strong>Snacks:</strong> {meal.snacks.join(", ")}</p>
                    <p><strong>Dinner:</strong> {meal.dinner.join(", ")}</p>
                  </div>
                ))
              ) : (
                <p>No meal records for this resident.</p>
              )}
            </>
          )}
        </div>


            {/* Activities */}
            <div className="resident-section">
              <h3>Activities</h3>
              {isEditing ? (
                <>
                  {editedResident.activities.map((activity, index) => (
                    <div key={activity._id || index}>
                      <label>Activity Name: </label>
                      <input
                        type="text"
                        value={activity.activityName || ""}
                        onChange={(e) => {
                          const updatedActivity = [...editedResident.activities];
                          updatedActivity[index].activityName = e.target.value;
                          setEditedResident({...editedResident, activities: updatedActivity});
                        }}
                      />
                      <label>Date: </label>
                      <input
                        type="date"
                        value={activity.date ? new Date(activity.date).toISOString().split('T')[0] : ""}
                        onChange={(e) => {
                          const updatedActivity = [...editedResident.activities];
                          updatedActivity[index].date = e.target.value;
                          setEditedResident({...editedResident, activities: updatedActivity});
                        }}
                      />
                      <label>Description: </label>
                      <textarea
                        value={activity.description || ""}
                        onChange={(e) => {
                          const updatedActivity = [...editedResident.activities];
                          updatedActivity[index].description = e.target.value;
                          setEditedResident({...editedResident, activities: updatedActivity});
                        }}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {selectedResident?.activities && selectedResident.activities.length > 0 ? (
                    selectedResident.activities.map((activity) => (
                      <div key={activity._id} className="activity-record">
                        <p><strong>Activity Name:</strong> {activity.activityName}</p>
                        <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                        <p><strong>Description:</strong> {activity.description}</p>
                      </div>
                    ))
                  ) : (
                    <p>No activities recorded for this resident.</p>
                  )}
                </>
              )}
            </div>
        
            <div className="button-container">
              {isEditing ? (
                <>
                  <button className="save-button" onClick={handleUpdateSubmit}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className="edit-button" onClick={handleEditClick}>
                    Edit Information
                  </button>
                  <button className="print-button" onClick={handlePrint}>
                    Print Information
                  </button>
                  <button
                    className="emergency-alert-button"
                    onClick={handleEmergencyAlert}
                  >
                    Emergency Alert
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </section>
      </div>
    </>
  );
};

export default ResidentList;