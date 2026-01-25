const mongoose = require("mongoose");
const { Role } = require("../model/collection");
const { recordActivity } = require('../utils/auditLogger');

mongoose.connect(process.env.MONGO_URI);

const createRole = async (req, res) => {
    try {
        const { company_id, name, description, permissions, color } = req.body;

        // Validate required fields
        if (!company_id || !name) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Create new role
        const newRole = new Role({
            company_id,
            name,
            description: description || '',
            permissions: permissions || [],
            color: color || 'blue'
        });

        await newRole.save();
        console.log("Role created successfully:", newRole);
        await recordActivity(req, { action: 'ROLE_CREATE', resource: '/role/create', result: 201, metadata: { name } });

        return res.status(201).json({
            success: true,
            message: "Role created successfully",
            role: {
                id: newRole.id,
                company_id: newRole.company_id,
                name: newRole.name,
                description: newRole.description,
                permissions: newRole.permissions,
                color: newRole.color
            }
        });
    } catch (error) {
        console.error("Error creating role:", error);
        await recordActivity(req, { action: 'ROLE_CREATE', resource: '/role/create', result: 400, metadata: { error: error.message } });
        return res.status(400).json({
            success: false,
            message: "Error creating role",
            error: error.message
        });
    }
};

const listRolesByCompany = async (req, res) => {
    try {
        const { company_id } = req.params;

        // Validate company_id
        if (!company_id) {
            return res.status(400).json({
                success: false,
                message: "Company ID is required"
            });
        }

        // Find all roles for the company
        const roles = await Role.find({ company_id });

        return res.status(200).json({
            success: true,
            count: roles.length,
            roles: roles.map(role => ({
                id: role.id,
                company_id: role.company_id,
                name: role.name,
                description: role.description,
                permissions: role.permissions,
                color: role.color
            }))
        });
    } catch (error) {
        console.error("Error fetching roles:", error);
        return res.status(400).json({
            success: false,
            message: "Error fetching roles",
            error: error.message
        });
    }
};

module.exports = { createRole, listRolesByCompany };
