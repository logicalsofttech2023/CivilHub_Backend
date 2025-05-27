const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  Auth
} = require("../models/authsModel");
const {
  Cate_job,
  Terms,
  Privacy,
  FAQ,
  TendorList,
  CompanyBanner,
  CompanyHeadline,
  CompanyBenefit
} = require("../models/adminModel");
const {
  FourtFolio,
  Project,
  save_status,
  Job
} = require("../models/companyModel");
const {
  freeFourtFolio,
  Apply,
  Apply_Project,
  Transaction_Report
} = require("../models/freelancerModel");


require("dotenv").config();

const CompanygetProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userId",
      });
    }

    const company = await Auth.findById(userId).select(
      "first_name last_name email mobile profile_image banner_image username rating address latitude longitude description links verify_profile block_status wallet_ammount"
    );

    if (!company) {
      return res.status(404).json({
        result: false,
        msg: "Company profile not found",
      });
    }


    const profileFields = {
      first_name: company.first_name,
      last_name: company.last_name,
      email: company.email,
      mobile: company.mobile,
      profile_image: company.profile_image,
      banner_image: company.banner_image,
      username: company.username,
      rating: company.rating,
      address: company.address,
      latitude: company.latitude,
      longitude: company.longitude,
      description: company.description,
      verify_profile: company.verify_profile,
      block_status: company.block_status,
      links: company.links && company.links.length > 0 ? company.links : null,
      wallet_ammount:company.wallet_ammount || 0,
    };


    const totalFields = Object.keys(profileFields).length;
    const filledFields = Object.values(profileFields).filter(
      (value) => value !== undefined && value !== null && value !== "" && value !== 0
    ).length;

    const profilePercentage = Math.round((filledFields / totalFields) * 100);

    return res.status(200).json({
      result: true,
      msg: "Company profile fetched successfully",
      data: {
        profile_percentage: profilePercentage + "%",
        userId: company._id || "",
        first_name: company.first_name || "",
        last_name: company.last_name || "",
        email: company.email || "",
        mobile: company.mobile || "",
        profile_image: company.profile_image || "",
        banner_image: company.banner_image || "",
        username: company.username || "",
        rating: company.rating || 0,
        address: company.address || "",
        lat: company.latitude || "",
        long: company.longitude || "",
        description: company.description || "",
        verify_profile: company.verify_profile || "",
        block_status: company.block_status || 0,
        company_links: company.links || [],
        wallet_ammount:company.wallet_ammount || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};



const addPortfolio = async (req, res) => {
  try {
    const { userId, name, about_project, skills } = req.body;
				const image = req.files ? req.files.map(file => file.filename).join(",") : null;
    if (!userId || !name || !image || !about_project || !skills) {
      return res.status(400).json({ result: false, msg: "userId, name and image, about_project, skills are required" });
    }

	const newData = new FourtFolio({
		 userId,
	         name,
	         about_project,
		 skills: skills
			 .split(",")
			 .map(s => s.trim())
			 .filter(s => s)
			 .filter((v, i, a) => a.indexOf(v) === i),
			  image,
			});

    await newData.save();

    return res.status(200).json({
      result: true,
      msg: "Portfolio added successfully",
      data: newData
    });

  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message
    });
  }
};


const companyfortfoliosList = async (req, res) => {
	try {
	    const { userId } = req.body;
	    if (!userId) {
		return res.status(400).json({
		      result: false,
		      msg: "Parameter required: userId",
		});
	   }
	   const Fortfolio = await FourtFolio.find({ userId });

	      if (!Fortfolio || Fortfolio.length === 0) {
		   return res.status(404).json({
			result: false,
			msg: "Fortfolio not found",
		    });
	      }
		const updatedPortfolio = Fortfolio.map((item) => {
		 let imageArray = [];

		  if (item.image && typeof item.image === "string") {
			imageArray = item.image
			 .split(",")
			 .map((img) => img.trim())
			 .filter(Boolean);
		  } else if (Array.isArray(item.image)) {
			imageArray = item.image;
		  }

		  return {
			...item._doc, 
			image: imageArray,
		       };
		 });

		return res.status(200).json({
			result: true,
			msg: "Fortfolio fetched successfully",
			data: updatedPortfolio,
		});
	} catch (error) {
		res.status(500).json({
		     result: false,
		     msg: "Something went wrong",
		     error: error.message,
		});
	}
};


const updatePortfolio = async (req, res) => {
  try {
    const { userId, name } = req.body;
    const image = req.files?.image ? req.files.image[0].filename : null;

    if (!userId || !name) {
      return res.status(400).json({ result: false, msg: "userId and name, image are required" });
    }

    const updateData = { name };
    if (image) updateData.image = image;

    const updated = await FourtFolio.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ result: false, msg: "Portfolio not found" });
    }

    return res.status(200).json({
      result: true,
      msg: "Portfolio updated successfully",
      data: updated
    });

  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message
    });
  }
};


const createPostprojectComapny = async (req, res) => {
  try {
    const { userID, catID, project_name, project_description, experience, budget_type, min_budget, mxn_budget, skills } = req.body;

    if (!userID || !catID || !project_name) {
      return res.status(400).json({ result: false, msg: "userID,catID,project_name,project_description,experience,budget_type,min_budget,mxn_budget,skills,fileattach is required" });
    }
    const skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : [];

    const fileattach = req.files ? req.files.map(file => file.filename).join(",") : null;

    const newProject = new Project({
      userID,
      catID,
      project_name,
      project_description,
      experience,
      budget_type,
      min_budget,
      mxn_budget,
      skills: skillsArray,
      fileattach
    });

    await newProject.save();

    res.status(201).json({
      result: true,
      msg: "Company Project Posted Successfully",
      data: newProject
    });

  } catch (error) {
    res.status(500).json({ result: false, msg: "Error posting Project", error: error.message });
  }
};

const UpdateCompanyProject = async (req, res) => {
  try {
    const { projectID, project_name, project_description, experience, budget_type, min_budget, mxn_budget, skills } = req.body;

    if (!projectID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: projectID (optional: project_name, project_description, experience, budget_type, min_budget, mxn_budget, skills )",
      });
    }

    if (!mongoose.isValidObjectId(projectID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid jobID format",
      });
    }

    const project = await Project.findById(projectID);
    if (!project) {
      return res.status(404).json({
        result: false,
        msg: "project not found",
      });
    }

    const skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : [];
    const fileattach = req.files ? req.files.map(file => file.filename).join(",") : null;

    if (project_name) project.project_name = project_name;
    if (project_description) project.project_description = project_description;
    if (experience) project.experience = experience;
    if (budget_type) project.budget_type = budget_type;
    if (min_budget) project.min_budget = min_budget;
    if (mxn_budget) project.mxn_budget = mxn_budget;
    if (skillsArray) project.skills = skillsArray;
    if (fileattach) project.fileattach = fileattach;

    await project.save();

    const responseUser = project.toObject();
    res.status(200).json({
      result: true,
      msg: "Company Project Information Updated Successfully",
      data: responseUser,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating company project information",
      error: error.message,
    });
  }
};

const createPostjobComapny = async (req, res) => {
  try {
    const { userID, catID, job_title, job_type, job_description, job_responsibilities, work_location_type, location, min_salary, mxn_salary, education, english, experience, skills } = req.body;

    if (!userID || !catID || !job_title || !job_type || !job_description) {
      return res.status(400).json({ result: false, msg: "userID,catID,job_title,job_type,job_description,job_responsibilities,work_location_type,location,min_salary,mxn_salary,education,english,experience,skills is required" });
    }
    const skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : [];

    // const fileattach = req.files ? req.files.map(file => file.filename).join(",") : null;

    const newJob = new Job({
      userID,
      catID,
      job_title,
      job_type,
      job_description,
      job_responsibilities,
      work_location_type,
      location,
      min_salary,
      mxn_salary,
      education,
      english,
      experience,
      skills: skillsArray
    });

    await newJob.save();

    res.status(201).json({
      result: true,
      msg: "Company Job Posted Successfully",
      data: newJob
    });

  } catch (error) {
    res.status(500).json({ result: false, msg: "Error posting job", error: error.message });
  }
};

const UpdateCompanyPost = async (req, res) => {
  try {
    const { jobID, job_title, job_type, job_description, job_responsibilities, work_location_type, location, min_salary, mxn_salary, education, english, experience, skills } = req.body;

    if (!jobID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: jobID (optional: job_title, job_type, job_description, job_responsibilities, work_location_type, location, min_salary, mxn_salary, education, english, experience, skills )",
      });
    }

    if (!mongoose.isValidObjectId(jobID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid jobID format",
      });
    }

    const job = await Job.findById(jobID);
    if (!job) {
      return res.status(404).json({
        result: false,
        msg: "job not found",
      });
    }
    const skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : [];

    if (job_title) job.job_title = job_title;
    if (job_type) job.job_type = job_type;
    if (job_description) job.job_description = job_description;
    if (job_responsibilities) job.job_responsibilities = job_responsibilities;
    if (work_location_type) job.work_location_type = work_location_type;
    if (location) job.location = location;
    if (min_salary) job.min_salary = min_salary;
    if (mxn_salary) job.mxn_salary = mxn_salary;
    if (education) job.education = education;
    if (english) job.english = english;
    if (experience) job.experience = experience;
    if (skillsArray) job.skills = skillsArray;

    await job.save();

    const responseUser = job.toObject();
    res.status(200).json({
      result: true,
      msg: "Company Job Information Updated Successfully",
      data: responseUser,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating company job information",
      error: error.message,
    });
  }
};

const AlljobcategoryFatchuser = async (req, res) => {
  try {
    const fatchcatejob = await Cate_job.find().sort({ _id: -1 });

    if (!fatchcatejob || fatchcatejob.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No job categories found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Job Category List",
      data: fatchcatejob,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};


const allfreelancerList = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        result: "false",
        msg: "Parameter Required: userId",
      });
    }

    const allfreelancer = await Auth.find({ account_type: "Freelancer" }).sort({ rating: -1 });

    const saveLikes = await save_status.find({ liked_by: userId });

    const saveLikeMap = {};
    saveLikes.forEach(item => {
      saveLikeMap[item.freelancerID.toString()] = item.save_like_status;
    });

    const filteredFreelancers = allfreelancer
      .map((freelancer) => {
        const {
          verify_profile,
          _id,
          first_name,
          last_name,
          email,
          username,
          profile_image,
          address,
          account_type,
          rating,
          description,
          total_projects_done,
          skills,
          links
        } = freelancer;

        const save_like_status_val = saveLikeMap[_id.toString()] || 0;

        const fieldsToCheck = [
          verify_profile,
          first_name,
          last_name,
          email,
          username,
          profile_image,
          address,
          description,
          total_projects_done,
          skills && skills.length > 0 ? skills : null,
          links && links.length > 0 ? links : null
        ];
        const totalFields = fieldsToCheck.length;
        const filledFields = fieldsToCheck.filter(field => field && field !== '').length;
        const profileCompletion = Math.round((filledFields / totalFields) * 100);

        if (profileCompletion >= 60) {
          return {
            _id,
            first_name,
            last_name,
            email,
            username,
            profile_image: freelancer.profile_image || "",
            address,
            account_type,
            verify_profile,
            rating,
            description: freelancer.description || "",
            total_projects_done,
            skills,
            links,
            save_like_status: save_like_status_val,
            profileCompletion: `${profileCompletion}%`
          };
        }

        return null;
      })
      .filter(Boolean); 

    return res.status(200).json({
      result: "true",
      msg: "Freelancer list fetched successfully",
      data: filteredFreelancers
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Error fetching freelancers",
      error: error.message
    });
  }
};

const saveLikeStatus = async (req, res) => {
  try {
    const { freelancerID, liked_by } = req.body;

    if (!freelancerID || !liked_by) {
      return res.status(400).json({
        result: false,
        msg: "freelancerID and liked_by are required",
      });
    }

    let existing = await save_status.findOne({ freelancerID, liked_by });

    if (!existing) {
      const newLike = new save_status({
        freelancerID,
        liked_by,
        save_like_status: '1',
      });
      await newLike.save();

      return res.status(200).json({
        result: true,
        msg: "Freelancer liked successfully",
        data: newLike,
      });
    } else {
      await save_status.deleteOne({ _id: existing._id });

      return res.status(200).json({
        result: true,
        msg: "Freelancer unliked successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Error processing like/unlike request",
      error: error.message,
    });
  }
};


const companyHeaderUpdate = async (req, res) => {
  try {
    const { userID, first_name, last_name, links, address, latitude, longitude } = req.body;

    const profile_image = req.files?.profile_image ? req.files.profile_image[0].filename : null;
    const banner_image = req.files?.banner_image ? req.files.banner_image[0].filename : null;

    if (!userID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userID (optional: first_name, last_name, links, profile_image, banner_image, address, latitude, longitude)",
      });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userID format",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (address) user.address = address;
    if (latitude) user.latitude = latitude;
    if (longitude) user.longitude = longitude;
    if (profile_image) user.profile_image = profile_image;
    if (banner_image) user.banner_image = banner_image;

    if (links) {
      try {
        let parsedLinks = JSON.parse(links);
        if (Array.isArray(parsedLinks)) {
          user.links = parsedLinks.map(link => ({
            type: link.type.trim(),
            url: link.url.trim(),
          }));
        } else {
          return res.status(400).json({
            result: false,
            msg: "Links should be an array of objects [{type, url}]",
          });
        }
      } catch (error) {
        return res.status(400).json({
          result: false,
          msg: "Invalid links format, must be a valid JSON array",
        });
      }
    }

    await user.save();


    const responseUser = user.toObject();
    responseUser.links = responseUser.links.map(({ type, url }) => ({ type, url }));

    res.status(200).json({
      result: true,
      msg: "Company Header Updated Successfully",
      data: responseUser,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating company header",
      error: error.message,
    });
  }
};



const companyContactinformationrUpdate = async (req, res) => {
  try {
    const { userID, email, mobile } = req.body;

    if (!userID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userID (optional: email, mobile )",
      });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userID format",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    await user.save();

    const responseUser = user.toObject();
    res.status(200).json({
      result: true,
      msg: "Company Information Updated Successfully",
      data: responseUser,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating company information",
      error: error.message,
    });
  }
};


const companyDescriptionUpdate = async (req, res) => {
  try {
    const { userID, description } = req.body;

    if (!userID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userID (optional: description )",
      });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userID format",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    if (description) user.description = description;
    await user.save();

    res.status(200).json({
      result: true,
      msg: "Company Description Updated Successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating company description",
      error: error.message,
    });
  }
};


const getTermsconditionCompany = async (req, res) => {
	try {
	 const fetchTerms = await Terms.find({ type: "Company" });

	  if (!fetchTerms || fetchTerms.length === 0) {
		return res.status(400).json({
		   result: "false",
		   msg: "No data found for type Company!"
		});
	  }

	  res.status(200).json({
	       result: "true",
	       msg: "Terms and Conditions list for type Company",
	       data: fetchTerms
	  });

	} catch (error) {
		return res.status(500).json({
			result: "false",
			msg: "Server error",
			error: error.message
		});
	}
};


const getprivacyCompany = async (req, res) => {
     try {
	const fetchprivacy = await Privacy.find({ type: "Company" });

	 if (!fetchprivacy || fetchprivacy.length === 0) {
	     return res.status(400).json({
		   result: "false",
		   msg: "No data found for type Company!"
	     });
	}

	res.status(200).json({
	     result: "true",
	     msg: "Privacy Policy list for type Company",
	     data: fetchprivacy
	});

     } catch (error) {
	 return res.status(500).json({
		result: "false",
		msg: "Server error",
		error: error.message
	});
    }
};

const getfaqCompany = async (req, res) => {
     try {
	 const fetchfaq = await FAQ.find({ type: "Company" });

	 if (!fetchfaq || fetchfaq.length === 0) {
	      return res.status(400).json({
		   result: "false",
		   msg: "No data found for type Company!"
	      });
	}

	res.status(200).json({
	     result: "true",
	     msg: "FAQ list for type Company",
	     data: fetchfaq
	});

    } catch (error) {
	return res.status(500).json({
	    result: "false",
	    msg: "Server error",
	    error: error.message
	});
    }
};


const CompanygetfreelnaceDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userId",
      });
    }

    const company = await Auth.findById(userId).select(
      "first_name last_name email mobile profile_image username total_project_comppleted rating experience resume_file skills education language emplement_history work_history description verify_profile banner_image address latitude longitude links"
    );

    if (!company) {
      return res.status(404).json({
        result: false,
        msg: "Freelancer Detail not found",
      });
    }

    const portfolio = await freeFourtFolio.find({ userId: userId }).select("name image userId about_project");

    const updatedPortfolio = portfolio.map((item) => {
      let imageArray = [];

      if (item.image && typeof item.image === "string") {
        imageArray = item.image.split(",").map((img) => img.trim()).filter(Boolean);
      }

      return {
        ...item._doc,
        image: imageArray,
      };
    });

    const profileFields = {
      first_name: company.first_name,
      last_name: company.last_name,
      email: company.email,
      mobile: company.mobile,
      profile_image: company.profile_image,
      banner_image: company.banner_image,
      resume_file: company.resume_file,
      username: company.username,
      rating: company.rating,
      address: company.address,
      latitude: company.latitude,
      longitude: company.longitude,
      description: company.description,
      verify_profile: company.verify_profile,
      experience: company.experience,
      total_project_comppleted: company.total_project_comppleted,
      links: company.links?.length > 0 ? company.links : null,
      skills: company.skills?.length > 0 ? company.skills : null,
      education: company.education?.length > 0 ? company.education : null,
      language: company.language?.length > 0 ? company.language : null,
      emplement_history: company.emplement_history?.length > 0 ? company.emplement_history : null,
      work_history: company.work_history?.length > 0 ? company.work_history : null,
    };

    const totalFields = Object.keys(profileFields).length;
    const filledFields = Object.values(profileFields).filter(
      (value) => value !== undefined && value !== null && value !== "" && value !== 0
    ).length;

    const profilePercentage = Math.round((filledFields / totalFields) * 100);

    return res.status(200).json({
      result: true,
      msg: "Freelancer Details fetched successfully",
      data: {
        profile_percentage: profilePercentage + "%",
        userId: company._id || "",
        first_name: company.first_name || "",
        last_name: company.last_name || "",
        email: company.email || "",
        mobile: company.mobile || "",
        profile_image: company.profile_image || "",
        banner_image: company.banner_image || "",
        resume_file: company.resume_file || "",
        username: company.username || "",
        rating: company.rating || 0,
        address: company.address || "",
        lat: company.latitude || "",
        long: company.longitude || "",
        description: company.description || "",
        verify_profile: company.verify_profile || false,
        experience: company.experience || "",
        total_project_comppleted: company.total_project_comppleted || 0,
        company_links: company.links || [],
        skills: company.skills || [],
        education: company.education || [],
        language: company.language || [],
        emplement_history: company.emplement_history || [],
        work_history: company.work_history || [],
        portfolio: updatedPortfolio,
      },
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};



const CompanygetjobList = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userId",
      });
    }

    const jobs = await Job.find({ userID: userId }).select(
      "userID catID job_title job_type job_description job_responsibilities work_location_type location min_salary mxn_salary education english experience skills total_proposal favorite_status createdAt"
    );

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        result: false,
        msg: "No jobs found for this user",
      });
    }

    const populatedJobs = await Promise.all(
      jobs.map(async (job) => {
        let category = await Cate_job.findById(job.catID).select("name image");

        return {
          ...job._doc,
          category_name: category?.name || "",
          category_image: category?.image || "",
        };
      })
    );

    return res.status(200).json({
      result: true,
      msg: "Job list fetched successfully",
      data: populatedJobs,
    });

  } catch (error) {
    console.error("Error fetching job list:", error.message);
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};



const CompanygetprojectList = async (req, res) => {
    try {
	const { userId } = req.body;

	 if (!userId) {
	     return res.status(400).json({
		  result: false,
		  msg: "Parameter required: userId",
	      });
	}

	  const project = await Project.find({ userID: userId }).select(
		"userID catID project_name project_description budget_type experience min_budget mxn_budget skills fileattach total_proposal favorite_status createdAt"
	  );

	    if (!project || project.length === 0) {
		   return res.status(404).json({
			result: false,
			msg: "No Project found for this user",
		   });
	   }

	      const populatedJobs = await Promise.all(
		   project.map(async (Project) => {
			 let category = await Cate_job.findById(Project.catID).select("name image");

			  return {
			       ...Project._doc,
			       category_name: category?.name || "",
			       category_image: category?.image || "",
			  };
		  })
	     );

	      const populatedJobsall = populatedJobs.map((item) => {
	      let fileattach = [];

	       if (item.fileattach && typeof item.fileattach === "string") {
		     fileattach = item.fileattach.split(",").map((img) => img.trim()).filter(Boolean);
	       }

		return {
			...item,
		        fileattach: fileattach, 
		 };
	      });

	      return res.status(200).json({
		   result: true,
		   msg: "Project list fetched successfully",
		   data: populatedJobsall,
	      });

	} catch (error) {
	     console.error("Error fetching job list:", error.message);
		res.status(500).json({
		    result: false,
		    msg: "Something went wrong",
		    error: error.message,
		});
	}
};


const CompanygetjobListDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userId",
      });
    }

    const jobs = await Job.find({ _id: userId }).select(
      "userID catID job_title job_type job_description job_responsibilities work_location_type location min_salary mxn_salary education english experience skills total_proposal favorite_status createdAt"
    );

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        result: false,
        msg: "No jobs details found for this user",
      });
    }

    const populatedJobs = await Promise.all(
      jobs.map(async (job) => {
        let category = await Cate_job.findById(job.catID).select("name image");

        return {
          ...job._doc,
          category_name: category?.name || "",
          category_image: category?.image || "",
        };
      })
    );

    return res.status(200).json({
      result: true,
      msg: "Job Details fetched successfully",
      data: populatedJobs,
    });

  } catch (error) {
    console.error("Error fetching job list:", error.message);
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};

const CompanygetprojectListDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userId",
      });
    }

    const project = await Project.find({ _id: userId }).select(
      "userID catID project_name project_description budget_type experience min_budget mxn_budget skills fileattach total_proposal favorite_status createdAt"
    );

    if (!project || project.length === 0) {
      return res.status(404).json({
        result: false,
        msg: "No Project Details found for this user",
      });
    }

    const populatedJobs = await Promise.all(
      project.map(async (Project) => {
        let category = await Cate_job.findById(Project.catID).select("name image");

        return {
          ...Project._doc,
          category_name: category?.name || "",
          category_image: category?.image || "",
        };
      })
    );

const populatedJobsall = populatedJobs.map((item) => {
	 let fileattach = [];

	  if (item.fileattach && typeof item.fileattach === "string") {
		 fileattach = item.fileattach.split(",").map((img) => img.trim()).filter(Boolean);
	  }

	  return {
	      ...item,
	      fileattach: fileattach, 
	 };
     });

    return res.status(200).json({
      result: true,
      msg: "Project Details fetched successfully",
      data: populatedJobsall,
    });

  } catch (error) {
    console.error("Error fetching job list:", error.message);
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};

const companyjobDelete = async (req, res) => {
  try {
    const { companyjobID } = req.body;

    if (!companyjobID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: companyjobID",
      });
    }

    const fatchjob = await Job.findById(companyjobID);
    if (!fatchjob) {
      return res.status(404).json({
        result: false,
        msg: "Company Job Not Found!",
      });
    }

    await Job.findByIdAndDelete(companyjobID);

    res.status(200).json({
      result: true,
      msg: "Company Job Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting company job",
      error: error.message,
    });
  }
};

const companyProjectDelete = async (req, res) => {
  try {
    const { comprojectID } = req.body;

    if (!comprojectID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: comprojectID",
      });
    }

    const fatchproject = await Project.findById(comprojectID);
    if (!fatchproject) {
      return res.status(404).json({
        result: false,
        msg: "Company Project Not Found!",
      });
    }

    await Project.findByIdAndDelete(comprojectID);

    res.status(200).json({
      result: true,
      msg: "Company Project Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting company project",
      error: error.message,
    });
  }
};


const companyportfolioDelete = async (req, res) => {
  try {
    const { portfolioId } = req.body;

    if (!portfolioId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: portfolioId",
      });
    }

    const fatchportfolio = await FourtFolio.findById(portfolioId);
    if (!fatchportfolio) {
      return res.status(404).json({
        result: false,
        msg: "Company Portfolio Not Found!",
      });
    }

    await FourtFolio.findByIdAndDelete(portfolioId);

    res.status(200).json({
      result: true,
      msg: "Company Portfolio Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting company portfolio",
      error: error.message,
    });
  }
};


const Companyjobapplication = async (req, res) => {
      try {
	  const { JobID } = req.body;
              if (!JobID) {
		  return res.status(400).json({
		        result: false,
		        msg: "Parameter required: JobID",
		  });
	      }
	   const jobs = await Apply.find({ JobID: JobID }).select(
		   "JobID FreelancerID cover_letter application_status fileattach_apply createdAt"
	    ).populate({
                path: "FreelancerID",
                select: "first_name last_name"  // Sirf ye do fields chahiye
            });
	   if (!jobs || jobs.length === 0) {
		 return res.status(404).json({
		       result: false,
		       msg: "No jobs Application found for this user",
		 });
	    }
               const response = jobs.map(p => ({
                    _id: p._id,
                     JobID: p.JobID, // handle whichever exists
                     cover_letter: p.cover_letter,
                     application_status: p.application_status,
                     fileattach_apply: p.fileattach_apply,
                     createdAt: p.createdAt,
                     first_name: p.FreelancerID?.first_name || "",
                     last_name: p.FreelancerID?.last_name || ""
               }));
	       return res.status(200).json({
		   result: true,
		   msg: "Job Application list fetched successfully",
	           data: response,
		});

	} catch (error) {
	      console.error("Error fetching job list:", error.message);
		res.status(500).json({
		    result: false,
		    msg: "Something went wrong",
		    error: error.message,
		});
	}
};

const CompanyjobapplicationDetails = async (req, res) => {
	try {
	    const { JobaaplicationID } = req.body;
	        if (!JobaaplicationID) {
		    return res.status(400).json({
                         result: false,
		         msg: "Parameter required: JobaaplicationID",
		     });
		}
		const jobs = await Apply.findById({ _id: JobaaplicationID }).select(
		      "JobID FreelancerID cover_letter application_status fileattach_apply createdAt"
		).populate({
                       path: "FreelancerID",
                       select: "first_name last_name profile_image"  // Sirf ye do fields chahiye
                });

		if (!jobs || jobs.length === 0) {
		     return res.status(404).json({
			   result: false,
			   msg: "No jobs Application Details found for this user",
		     });
		}
		return res.status(200).json({
			result: true,
		        msg: "Job Application Details fetched successfully",
			data: {
                              _id: jobs._id,
                              JobID: jobs.JobID || '', // handle whichever exists
                              FreelancerID: jobs.FreelancerID?._id || '', // handle whichever exists
                              cover_letter: jobs.cover_letter,
                              application_status: jobs.application_status,
                              fileattach_apply: jobs.fileattach_apply,
                              createdAt: jobs.createdAt,
                              first_name: jobs.FreelancerID?.first_name || "",
                              last_name: jobs.FreelancerID?.last_name || "",
                              profile_image:jobs.FreelancerID?.profile_image || "",
                             },
		});

	} catch (error) {
	       console.error("Error fetching job list:", error.message);
		res.status(500).json({
		     result: false,
		     msg: "Something went wrong",
		     error: error.message,
		});
	}
};


const updateApplicationStatuschanges = async (req, res) => {
	try {
	    const { applicationId, freelancerId, action } = req.body;

		if (!applicationId || !freelancerId || !action) {
		    return res.status(400).json({
			 result: false,
			  msg: "Missing parameters: applicationId, freelancerId, and action ( Accept/Reject ) are required",
		    });
		}

		if (!["Accept", "Reject"].includes(action)) {
		    return res.status(400).json({
			 result: false,
			  msg: "Action must be either 'Accept' or 'Reject'",
		    });
		}

		const newStatus = action === "Accept" ? "Active" : "Declined";

		const updatedApp = await Apply.findOneAndUpdate(
		     { _id: applicationId, FreelancerID: freelancerId },
		     { application_status: newStatus },
		     { new: true }
		);

		if (!updatedApp) {
		    return res.status(404).json({
			result: false,
			msg: "Application not found",
		    });
		}

		 return res.status(200).json({
			result: true,
			msg: `Application ${newStatus.toLowerCase()} successfully`,
			data: updatedApp,
		});

	} catch (error) {
		console.error("Error updating application status:", error.message);
		 return res.status(500).json({
			result: false,
			msg: "Server error",
			error: error.message,
		});
	}
};


const Companyprojectprposal = async (req, res) => {
	try {
	    const { projectID	} = req.body;

	    if (!projectID) {
		  return res.status(400).json({
		       result: false,
		       msg: "Parameter required: projectID",
		  });
	      }
		const projects = await Apply_Project.find({ projectID: projectID }).select(
		      "projectID FreelancerID rate cover_letter application_status fileattach_apply createdAt"
		).populate({
                     path: "FreelancerID",
                     select: "first_name last_name"  // Sirf ye do fields chahiye
                });
		if (!projects || projects.length === 0) {
		      return res.status(404).json({
			    result: false,
			    msg: "No Project Proposal found for this user",
			});
		}
                       const response = projects.map(p => ({
                             _id: p._id,
                             projectID: p.projectID, // handle whichever exists
                             rate: p.rate,
                             cover_letter: p.cover_letter,
                             application_status: p.application_status,
                             fileattach_apply: p.fileattach_apply,
                             createdAt: p.createdAt,
                             first_name: p.FreelancerID?.first_name || "",
                             last_name: p.FreelancerID?.last_name || ""
                       }));
		      return res.status(200).json({
			     result: true,
			     msg: "Project Proposal list fetched successfully",
			     data: response,
			});

	} catch (error) {
	    console.error("Error fetching job list:", error.message);
	    res.status(500).json({
	        result: false,
	        msg: "Something went wrong",
	        error: error.message,
	    });
	}
};


const CompanyprojectproposalDetails = async (req, res) => {
	try {
	    const { projectproposalID } = req.body;
	    if (!projectproposalID) {
		return res.status(400).json({
                      result: false,
		      msg: "Parameter required: projectproposalID",
		});
	    }
	     const projects = await Apply_Project.findById({ _id: projectproposalID }).select(
		"JobID FreelancerID rate cover_letter application_status fileattach_apply createdAt"
	     ).populate({
                   path: "FreelancerID",
                   select: "first_name last_name profile_image"  // Sirf ye do fields chahiye
             });
	     if (!projects || projects.length === 0) {
		   return res.status(404).json({
		       result: false,
		       msg: "No Projects Proposal Details found for this user",
		    });
	     }
		return res.status(200).json({
			result: true,
			msg: "Project Proposal Details fetched successfully",
		        //data: projects,
                        data: {
                           _id: projects._id,
                           JobID: projects.JobID || '', // handle whichever exists
                           FreelancerID: projects.FreelancerID?._id || '', // handle whichever exists
                           rate:projects.rate,
                           cover_letter: projects.cover_letter,
                           application_status: projects.application_status,
                           fileattach_apply: projects.fileattach_apply,
                           createdAt: projects.createdAt,
                           first_name: projects.FreelancerID?.first_name || "",
                           last_name: projects.FreelancerID?.last_name || "",
                           profile_image:projects.FreelancerID?.profile_image || "",
                       },
		});

	} catch (error) {
		console.error("Error fetching job list:", error.message);
		res.status(500).json({
		    result: false,
		    msg: "Something went wrong",
		    error: error.message,
		});
	}
};


const updateprojetcproposalStatuschanges = async (req, res) => {
	try {
	   const { projectproposalID, freelancerId, action } = req.body;

	   if (!projectproposalID || !freelancerId || !action) {
		return res.status(400).json({
			result: false,
			msg: "Missing parameters: projectproposalID, freelancerId, and action ( Accept/Reject ) are required",
		 });
	  }

	  if (!["Accept", "Reject"].includes(action)) {
		  return res.status(400).json({
			result: false,
			msg: "Action must be either 'Accept' or 'Reject'",
		   });
	  }

	     const newStatus = action === "Accept" ? "Active" : "Declined";

		const updatedApp = await Apply_Project.findOneAndUpdate(
		     { _id: projectproposalID, FreelancerID: freelancerId },
		     { application_status: newStatus },
		     { new: true }
		);

		if (!updatedApp) {
		     return res.status(404).json({
			 result: false,
			  msg: "Project Proposal not found",
		     });
		}

		return res.status(200).json({
			result: true,
			msg: `Project Proposal ${newStatus.toLowerCase()} successfully`,
			data: updatedApp,
		});

	} catch (error) {
	      console.error("Error updating application status:", error.message);
		return res.status(500).json({
			result: false,
			msg: "Server error",
			error: error.message,
		});
	}
};

const CategoryfreelancerList = async (req, res) => {
  try {
    const { userId,subcategoryId } = req.body;

    if (!userId || !subcategoryId) {
      return res.status(400).json({
        result: "false",
        msg: "Parameter Required: userId & subcategoryId",
      });
    }

    const allfreelancer = await Auth.find({ account_type: "Freelancer",subcategoryId:subcategoryId,block_status: 0 }).sort({ rating: -1 });

    const saveLikes = await save_status.find({ liked_by: userId });

    const saveLikeMap = {};
    saveLikes.forEach(item => {
      saveLikeMap[item.freelancerID.toString()] = item.save_like_status;
    });

    const filteredFreelancers = allfreelancer
      .map((freelancer) => {
        const {
          verify_profile,
          _id,
          first_name,
          last_name,
          email,
          username,
          profile_image,
          address,
          account_type,
          rating,
          description,
          total_projects_done,
          skills,
          links
        } = freelancer;

        const save_like_status_val = saveLikeMap[_id.toString()] || 0;

        const fieldsToCheck = [
          verify_profile,
          first_name,
          last_name,
          email,
          username,
          profile_image,
          address,
          description,
          total_projects_done,
          skills && skills.length > 0 ? skills : null,
          links && links.length > 0 ? links : null
        ];
        const totalFields = fieldsToCheck.length;
        const filledFields = fieldsToCheck.filter(field => field && field !== '').length;
        const profileCompletion = Math.round((filledFields / totalFields) * 100);

        if (profileCompletion >= 60) {
          return {
            _id,
            first_name,
            last_name,
            email,
            username,
            profile_image: freelancer.profile_image || "",
            address,
            account_type,
            verify_profile,
            rating,
            description: freelancer.description || "",
            total_projects_done,
            skills,
            links,
            save_like_status: save_like_status_val,
            profileCompletion: `${profileCompletion}%`
          };
        }

        return null;
      })
      .filter(Boolean); 

    return res.status(200).json({
      result: "true",
      msg: "Freelancer list fetched successfully",
      data: filteredFreelancers
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Error fetching freelancers",
      error: error.message
    });
  }
};

const addcompanyTransaction = async (req, res) => {
  try {
    const { userId, title, ammount, type, transaction_status } = req.body;

    if (!userId || !title || !ammount || !type || !transaction_status) {
      return res.status(400).json({ result: false, msg: "userId, title, ammount, type(Credit,Debit), transaction_status are required" });
    }

    const userData = await Auth.findById({ _id:userId });

    if (!userData) {
      return res.status(404).json({
        result: false,
        msg: "userId not found",
      });
    }

    const newData = new Transaction_Report({
      userId, title, ammount, type, transaction_status
    });

    await newData.save();
    const WalletAmmount = userData.wallet_ammount || 0;
    let totalAmmount;

    if (type.toLowerCase() === "credit" && transaction_status.toLowerCase() === "success") {
      totalAmmount = WalletAmmount + ammount;
    } else if (type.toLowerCase() === "debit" && transaction_status.toLowerCase() === "success") {
      if (WalletAmmount < ammount) {
        return res.status(400).json({
          result: false,
          msg: "Insufficient wallet balance for debit"
        });
      }
      totalAmmount = WalletAmmount - ammount;
    } else {
      return res.status(400).json({
        result: false,
        msg: "Invalid transaction type. Must be Credit or Debit"
      });
    }

    await Auth.findByIdAndUpdate(userId, { wallet_ammount: totalAmmount }, { new: true });
    return res.status(200).json({
      result: true,
      msg: "freelancer transaction report added successfully",
      data: newData
    });

  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message
    });
  }
};


const getcompanyTransaction = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(404).json({ 
        result: false,
        msg: "Required parameters: userId",
      });
    }

    const projects = await Transaction_Report.find({userId:userId})
      .sort({ createdAt: -1 })
      .select(
        "_id userId title ammount type transaction_status createdAt"
      ).populate({
        path: "userId",
        select: "wallet_ammount"  // Sirf ye do fields chahiye
      });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ 
        result: false,
        msg: "No jobs found",
      });
    }else{
      const response = projects.map(p => ({
          _id: p._id,
          userId: p.userId?._id || '', // handle whichever exists
          title: p.title,
          ammount: p.ammount,
          type: p.type,
          fileattach_apply: p.fileattach_apply,
          transaction_status:p.transaction_status,
          createdAt: p.createdAt,
          wallet_ammount: p.userId?.wallet_ammount || 0,  
        }));

        return res.status(200).json({
          result: true,
          msg: "transaction report list fetched successfully",
          data: response,
        });
    }    

  } catch (error) {
    console.error("Error fetching job list:", error.message);
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};

const getAllTendorList = async (req, res) => {
  try {
    const fetchTendor = await TendorList.find({}).sort({'createdAt': -1});

    if (!fetchTendor || fetchTendor.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for Tendor List!"
      });
    }

    res.status(200).json({
      result: "true",
      msg: "All Tendor list for type Company",
      data: fetchTendor
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message
    });
  }
};

const GetCompanyBanner = async (req, res) => {
  try {
    const fatchbanner = await CompanyBanner.find().sort({ _id: -1 });

    if (!fatchbanner || fatchbanner.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No banner found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Company Banner List",
      data: fatchbanner,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const getCompanyHeadline = async (req, res) => {
  try {
    const fatchheadline = await CompanyHeadline.find().sort({ _id: -1 });

    if (!fatchheadline || fatchheadline.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No company headline found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Company Headline List",
      data: fatchheadline,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const getCompanyBenefit = async (req, res) => {
  try {
    const fatchBenefit = await CompanyBenefit.find().sort({ _id: -1 });

    if (!fatchBenefit || fatchBenefit.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No Company Benefit found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Company Benefit List",
      data: fatchBenefit,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};



module.exports = {
  CompanygetProfile,
  addPortfolio,
  companyfortfoliosList,
  updatePortfolio,
  createPostprojectComapny,
  UpdateCompanyProject,
  createPostjobComapny,
  UpdateCompanyPost,
  AlljobcategoryFatchuser,
  allfreelancerList,
  saveLikeStatus,
  companyHeaderUpdate,
  companyContactinformationrUpdate,
  companyDescriptionUpdate,
  getTermsconditionCompany,
  getprivacyCompany,
  getfaqCompany,
  CompanygetfreelnaceDetails,
  CompanygetjobList,
  CompanygetprojectList,
  CompanygetjobListDetails,
  CompanygetprojectListDetails,
  companyjobDelete,
  companyProjectDelete,
  companyportfolioDelete,
  Companyjobapplication,
  CompanyjobapplicationDetails,
  updateApplicationStatuschanges,
  Companyprojectprposal,
  CompanyprojectproposalDetails,
  updateprojetcproposalStatuschanges,
  CategoryfreelancerList,
  addcompanyTransaction,
  getcompanyTransaction,
  getAllTendorList,
  GetCompanyBanner,
  getCompanyHeadline,
  getCompanyBenefit
};
